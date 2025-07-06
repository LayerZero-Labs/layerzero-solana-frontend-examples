import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, useMemo, useCallback } from "react";
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
import { CONTRACTS } from "../config/contracts";
import oftIdl from "../solana/idl/oft.json";
import type Oft from "../solana/idl/oft.json";

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

  // ------------------------------------------------------------
  // Program‑level constants
  // ------------------------------------------------------------
  const { tokenMint, programId, oftStore } = useMemo(() => {
    try {
      return {
        tokenMint: new PublicKey(CONTRACTS.SOLANA_OFT_MINT_ADDRESS),
        programId: new PublicKey(CONTRACTS.SOLANA_PROGRAM_ADDRESS),
        oftStore: new PublicKey(CONTRACTS.SOLANA_OFT_STORE_ADDRESS),
      };
    } catch (e) {
      console.error("Error parsing addresses", e);
      return { tokenMint: null, programId: null, oftStore: null } as const;
    }
  }, []);

  // ------------------------------------------------------------
  // Anchor helpers
  // ------------------------------------------------------------
  const getProvider = useCallback(() => {
    if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) return null;
    
    // Create anchor-compatible wallet from the main wallet
    const anchorWallet = {
      publicKey: wallet.publicKey,
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
  }, [connection, wallet]);

  const getProgram = useCallback(() => {
    const provider = getProvider();
    if (!provider || !programId) return null;
    // @ts-expect-error - anchor types mismatch but it works
    return new Program<typeof Oft>(oftIdl, programId, provider); // Note: do not change the order of the arguments. Maintain: idl, programId, provider (if on anchor v0.29)
  }, [getProvider, programId]);

  // ------------------------------------------------------------
  // Balance
  // ------------------------------------------------------------
  const fetchBalance = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey || !tokenMint) return;

    setIsLoadingBalance(true);
    setError(null);

    try {
      const ata = await getAssociatedTokenAddress(tokenMint, wallet.publicKey);
      const account = await getAccount(connection, ata);

      const mintInfo = await connection.getParsedAccountInfo(tokenMint);
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
  }, [connection, tokenMint, wallet.connected, wallet.publicKey]);

  // ------------------------------------------------------------
  // Associated Token Account
  // ------------------------------------------------------------
  const createAssociatedTokenAccount = useCallback(
    async (user: PublicKey): Promise<PublicKey> => {
      if (!tokenMint) throw new Error("Token mint not initialised");

      const ata = await getAssociatedTokenAddress(tokenMint, user);

      try {
        await getAccount(connection, ata);
        return ata;
      } catch (err) {
        if (err instanceof TokenAccountNotFoundError) {
          const ix = createAssociatedTokenAccountInstruction(
            user,
            ata,
            user,
            tokenMint
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
    [connection, getProvider, tokenMint]
  );

  // ------------------------------------------------------------
  // Mint
  // ------------------------------------------------------------
  const handleMint = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey || !tokenMint || !programId || !oftStore) {
      setError("Wallet not connected or contracts not initialised");
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
        wallet.publicKey
      );

      const [dailyMintLimit] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("DailyMintLimit"),
          wallet.publicKey.toBuffer(),
        ],
        programId
      );

      console.log('=== Account Verification ===');
      console.log('User:', wallet.publicKey.toString());
      console.log('OftStore:', oftStore.toString());
      console.log('TokenMint:', tokenMint.toString());
      console.log('DailyMintLimit PDA:', dailyMintLimit.toString());
      console.log('UserTokenAccount:', userTokenAccount.toString());
      console.log('Program ID:', programId.toString());

      // Verify ATA calculation
      const expectedAta = await getAssociatedTokenAddress(tokenMint, wallet.publicKey);
      console.log('Expected ATA:', expectedAta.toString());
      console.log('Using ATA:', userTokenAccount.toString());
      console.log('ATA Match:', expectedAta.equals(userTokenAccount));

      const signature = await program.methods
        .mintToken()
        .accounts({
          user: wallet.publicKey,
          oftStore,
          tokenMint,
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
    wallet.connected,
    wallet.publicKey,
    tokenMint,
    programId,
    oftStore,
    getProvider,
    getProgram,
    createAssociatedTokenAccount,
    connection,
    fetchBalance,
  ]);

  // ------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      fetchBalance();
    } else {
      // Reset state when wallet disconnects
      setBalance({ amount: 0, decimals: 6, uiAmount: 0 });
      setError(null);
    }
  }, [wallet.connected, wallet.publicKey, fetchBalance]);

  return {
    wallet,
    balance,
    isLoadingBalance,
    isMinting,
    error,
    tokenMint,
    programId,
    oftStore,
    fetchBalance,
    handleMint,
  };
} 