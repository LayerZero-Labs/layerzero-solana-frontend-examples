import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
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

export default function SolanaOftCard() {
  const wallet = useAnchorWallet();
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
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
  }, [connection, wallet]);

  const getProgram = useCallback(() => {
    const provider = getProvider();
    if (!provider || !programId) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Program(oftIdl as any, provider);
  }, [getProvider, programId]);

  // ------------------------------------------------------------
  // Balance
  // ------------------------------------------------------------
  const fetchBalance = useCallback(async () => {
    if (!wallet?.publicKey || !tokenMint) return;

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
  }, [connection, tokenMint, wallet?.publicKey]);

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
    if (!wallet?.publicKey || !tokenMint || !programId || !oftStore) {
      setError("Wallet not connected or contracts not initialised");
      return;
    }

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
    wallet?.publicKey,
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
    if (wallet?.publicKey) fetchBalance();
  }, [wallet?.publicKey, fetchBalance]);

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  if (!tokenMint || !programId || !oftStore) {
    return (
      <div className="bg-layerzero-gray-900 border border-layerzero-gray-800 rounded-none p-6">
        <h3 className="text-lg font-medium text-layerzero-white mb-4">
          Solana OFT
        </h3>
        <p className="text-sm text-layerzero-gray-400">
          Loading contract configuration...
        </p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-layerzero-gray-900 border border-layerzero-gray-800 rounded-none p-6">
        <h3 className="text-lg font-medium text-layerzero-white mb-4">
          Solana OFT
        </h3>
        <p className="text-sm text-layerzero-gray-400">
          Connect your wallet to view and mint OFT tokens.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-layerzero-gray-900 border border-layerzero-gray-800 rounded-none p-6">
      <h3 className="text-lg font-medium text-layerzero-white mb-4">
        Solana OFT
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-layerzero-gray-800 border border-red-400 text-red-400 rounded-none">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
          <h4 className="font-medium text-layerzero-white mb-2">
            Balance
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-layerzero-white">
              {isLoadingBalance
                ? "Loading..."
                : `${balance.uiAmount.toLocaleString()} OFT`}
            </p>
            <button
              onClick={fetchBalance}
              disabled={isLoadingBalance}
              className="lz-button text-xs py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingBalance ? "Loading..." : "Refresh"}
            </button>
          </div>
          <p className="text-sm text-layerzero-gray-400 mt-1">
            <span className="font-medium">Mint:</span>
            <span className="font-mono text-xs ml-1">{tokenMint.toString()}</span>
          </p>
          {oftStore && (
            <p className="text-sm text-layerzero-gray-400 mt-1">
              <span className="font-medium">OFT Store:</span>
              <span className="font-mono text-xs ml-1">{oftStore.toString()}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={handleMint}
            disabled={isMinting}
            className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMinting ? "Minting OFT Tokens..." : "Mint OFT Tokens"}
          </button>

          <p className="text-xs text-layerzero-gray-500 text-center">
            Using the OFT Program's mock mint function (public)
          </p>
        </div>
      </div>
    </div>
  );
}
