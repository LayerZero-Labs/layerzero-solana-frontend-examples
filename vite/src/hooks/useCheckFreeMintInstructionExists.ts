import { useState, useCallback, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { useStableSolanaContractsWeb3, useWalletReady } from './utils';
import oftIdl from "../vm-artifacts/solana/idl/oft.json";
import type Oft from "../vm-artifacts/solana/idl/oft.json";

export function useCheckFreeMintInstructionExists() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isMintTokenInstructionAvailable, setIsMintTokenInstructionAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  // Use utility hooks
  const walletReady = useWalletReady();
  const contractValues = useStableSolanaContractsWeb3();

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
    return new Program<typeof Oft>(oftIdl, contractValues.programId, provider);
  }, [getProvider, contractValues.programId]);

  // ------------------------------------------------------------
  // Mint Token Method Validation
  // ------------------------------------------------------------
  const checkMintTokenExists = useCallback(async () => {
    if (isChecking) return isMintTokenInstructionAvailable;
    
    setIsChecking(true);
    
    try {
      const program = getProgram();
      if (!program) {
        setIsMintTokenInstructionAvailable(false);
        return false;
      }

      // Method 1: Check if method exists on program object
      const hasMethod = program.methods.mintToken !== undefined;
      
      // Method 2: Check IDL for the instruction (additional validation)
      const hasInstruction = program.idl.instructions.some(
        (instruction) => instruction.name === "mintToken"
      );
      
      let canBuildInstruction = false;
      
      // Method 3: Try to build the instruction without executing (only if wallet is ready)
      if (hasMethod && hasInstruction && walletReady.isReady && contractValues.tokenMint && contractValues.oftStore) {
        try {
          const userTokenAccount = await getAssociatedTokenAddress(
            contractValues.tokenMint, 
            wallet.publicKey!
          );
          
          const [dailyMintLimit] = PublicKey.findProgramAddressSync(
            [Buffer.from("DailyMintLimit"), wallet.publicKey!.toBuffer()],
            contractValues.programId
          );

          // Try to build the instruction (this will throw if method signature is wrong)
          await program.methods
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
            .instruction(); // Use .instruction() to build without executing
          
          canBuildInstruction = true;
        } catch (error) {
          console.warn("Could not build mintToken instruction:", error);
          canBuildInstruction = false;
        }
      } else {
        // If wallet is not ready, skip the instruction building test
        canBuildInstruction = hasMethod && hasInstruction;
      }
      
      const isAvailable = hasMethod && hasInstruction && canBuildInstruction;
      setIsMintTokenInstructionAvailable(isAvailable);
      return isAvailable;
    } catch (error) {
      console.error("mintToken method validation failed:", error);
      setIsMintTokenInstructionAvailable(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, isMintTokenInstructionAvailable, getProgram, walletReady.isReady, contractValues, wallet.publicKey]);

  // ------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------
  useEffect(() => {
    if (walletReady.isReady && contractValues.programId) {
      checkMintTokenExists();
    } else {
      // Reset state when wallet disconnects or contracts not ready
      setIsMintTokenInstructionAvailable(null);
    }
  }, [walletReady.isReady, contractValues.programId, checkMintTokenExists]);

  return {
    isMintTokenInstructionAvailable,
    isChecking,
    checkMintTokenExists,
  };
} 