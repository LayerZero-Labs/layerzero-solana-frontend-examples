import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, useCallback } from "react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import oftIdl from "../vm-artifacts/solana/idl/oft.json";
import type Oft from "../vm-artifacts/solana/idl/oft.json";

// Import utilities
import { useStableSolanaContractsWeb3, useWalletReady } from './utils';
import { useCheckFreeMintInstructionExists } from './useCheckFreeMintInstructionExists';

interface TokenBalance {
  amount: number;
  decimals: number;
  uiAmount: number;
}

interface AnchorError {
  error?: {
    errorMessage?: string;
  };
  message?: string;
}

// Custom hook for Solana OFT logic
export function useSolanaOft() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isMinting, setIsMinting] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balance, setBalance] = useState<TokenBalance>({
    amount: 0,
    decimals: 6,
    uiAmount: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Use utility hooks
  const walletReady = useWalletReady();
  const contractValues = useStableSolanaContractsWeb3();
  const { isMintTokenInstructionAvailable, isChecking, checkMintTokenExists } = useCheckFreeMintInstructionExists();

  // ------------------------------------------------------------
  // Anchor helpers
  // ------------------------------------------------------------
  const getProvider = useCallback(() => {
    if (!walletReady.isReady || !wallet.signTransaction) return null;
    
    // Create anchor-compatible wallet from the main wallet
    const anchorWallet = {
      publicKey: wallet.publicKey!,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions || (async (txs) => {
        // Fallback: sign transactions one by one if signAllTransactions is not available
        const signedTxs = [];
        for (const tx of txs) {
          signedTxs.push(await wallet.signTransaction!(tx));
        }
        return signedTxs;
      }),
    };
    
    return new AnchorProvider(connection, anchorWallet, {
      commitment: "confirmed",
    });
  }, [connection, wallet, walletReady.isReady]);

  const getProgram = useCallback(() => {
    const provider = getProvider();
    if (!provider || !contractValues.programId) return null;
    // @ts-expect-error - anchor types mismatch but it works
    return new Program<typeof Oft>(oftIdl, contractValues.programId, provider); // Note: do not change the order of the arguments. Maintain: idl, programId, provider (if on anchor v0.29)
  }, [getProvider, contractValues.programId]);

  // ------------------------------------------------------------
  // Balance
  // ------------------------------------------------------------
  const fetchBalance = useCallback(async () => {
    if (!walletReady.isReady || !contractValues.tokenMint) return;

    setIsLoadingBalance(true);
    setError(null);

    try {
      const ata = await getAssociatedTokenAddress(contractValues.tokenMint, wallet.publicKey!);
      const account = await getAccount(connection, ata);

      const mintInfo = await connection.getParsedAccountInfo(contractValues.tokenMint);
      const decimals =
        mintInfo.value?.data && "parsed" in mintInfo.value.data
          ? (mintInfo.value.data.parsed.info.decimals as number) ?? 6
          : 6;

      setBalance({
        amount: Number(account.amount),
        decimals,
        uiAmount: Number(account.amount) / 10 ** decimals,
      });
    } catch (err) {
      if (err instanceof TokenAccountNotFoundError) {
        setBalance({ amount: 0, decimals: 6, uiAmount: 0 });
      } else {
        console.error(err);
        setError("Failed to fetch token balance");
      }
    } finally {
      setIsLoadingBalance(false);
    }
  }, [connection, contractValues.tokenMint, walletReady.isReady, wallet.publicKey]);

  // ------------------------------------------------------------
  // Associated Token Account
  // ------------------------------------------------------------
  const createAssociatedTokenAccount = useCallback(
    async (user: PublicKey): Promise<PublicKey> => {
      if (!contractValues.tokenMint) throw new Error("Token mint not initialised");

      const ata = await getAssociatedTokenAddress(contractValues.tokenMint, user);

      try {
        await getAccount(connection, ata);
        return ata;
      } catch (err) {
        if (err instanceof TokenAccountNotFoundError) {
          const ix = createAssociatedTokenAccountInstruction(
            user,
            ata,
            user,
            contractValues.tokenMint
          );

          const provider = getProvider();
          if (!provider) throw new Error("Provider not initialised");

          const tx = new Transaction().add(ix);
          const sig = await provider.sendAndConfirm(tx, []);

          console.log("Created ATA", sig);
          return ata;
        }
        throw err;
      }
    },
    [connection, getProvider, contractValues.tokenMint]
  );

  // ------------------------------------------------------------
  // Mint
  // ------------------------------------------------------------
  const handleMint = useCallback(async () => {
    if (!walletReady.isReady || !contractValues.tokenMint || !contractValues.programId || !contractValues.oftStore) {
      setError("Wallet not connected or contracts not initialised");
      return;
    }

    // Check if mintToken method exists before proceeding
    const mintTokenExists = await checkMintTokenExists();
    if (!mintTokenExists) {
      setError("mintToken method is not available on this program");
      return;
    }

    console.log('=== Minting ===');

    setIsMinting(true);
    setError(null);

    try {
      const provider = getProvider();
      const program = getProgram();
      if (!provider || !program) throw new Error("Provider / Program missing");

      const userTokenAccount = await createAssociatedTokenAccount(
        wallet.publicKey!
      );

      const [dailyMintLimit] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("DailyMintLimit"),
          wallet.publicKey!.toBuffer(),
        ],
        contractValues.programId
      );

      console.log('=== Account Verification ===');
      console.log('User:', wallet.publicKey!.toString());
      console.log('OftStore:', contractValues.oftStore.toString());
      console.log('TokenMint:', contractValues.tokenMint.toString());
      console.log('DailyMintLimit PDA:', dailyMintLimit.toString());
      console.log('UserTokenAccount:', userTokenAccount.toString());
      console.log('Program ID:', contractValues.programId.toString());

      // Verify ATA calculation
      const expectedAta = await getAssociatedTokenAddress(contractValues.tokenMint, wallet.publicKey!);
      console.log('Expected ATA:', expectedAta.toString());
      console.log('Using ATA:', userTokenAccount.toString());
      console.log('ATA Match:', expectedAta.equals(userTokenAccount));

      const signature = await program.methods
        .mintToken()
        .accounts({
          user: wallet.publicKey!,
          oftStore: contractValues.oftStore,
          tokenMint: contractValues.tokenMint,
          dailyMintLimit,
          userTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("OFT mint tx:", signature);
      await connection.confirmTransaction(signature, "confirmed");
      await fetchBalance();
    } catch (err) {
      console.error("Error minting", err);
      const anchorError = err as AnchorError;
      const msg =
        anchorError?.error?.errorMessage ?? anchorError?.message ?? "Failed to mint OFT tokens";
      setError(msg);
    } finally {
      setIsMinting(false);
    }
  }, [
    walletReady.isReady,
    wallet.publicKey,
    contractValues.tokenMint,
    contractValues.programId,
    contractValues.oftStore,
    getProvider,
    getProgram,
    createAssociatedTokenAccount,
    connection,
    fetchBalance,
    checkMintTokenExists,
  ]);

  // ------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------
  useEffect(() => {
    if (walletReady.isReady) {
      fetchBalance();
    } else {
      // Reset state when wallet disconnects
      setBalance({ amount: 0, decimals: 6, uiAmount: 0 });
      setError(null);
    }
  }, [walletReady.isReady, fetchBalance]);

  return {
    wallet,
    balance,
    isLoadingBalance,
    isMinting,
    error,
    tokenMint: contractValues.tokenMint,
    programId: contractValues.programId,
    oftStore: contractValues.oftStore,
    fetchBalance,
    handleMint,
    isMintTokenInstructionAvailable,
    isChecking,
    checkMintTokenExists,
  };
} 