import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, getAccount, TokenAccountNotFoundError, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BorshInstructionCoder } from "@coral-xyz/anchor";
import { CONTRACTS } from "../config/contracts";
import oftIdl from "../solana/idl/oft.json";

interface TokenBalance {
  amount: number;
  decimals: number;
  uiAmount: number;
}

export default function SolanaOftCard() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isMinting, setIsMinting] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balance, setBalance] = useState<TokenBalance>({
    amount: 0,
    decimals: 6,
    uiAmount: 0
  });
  const [error, setError] = useState<string | null>(null);

  const tokenMint = new PublicKey(CONTRACTS.SOLANA_OFT_MINT_ADDRESS);
  const programId = new PublicKey(CONTRACTS.SOLANA_PROGRAM_ADDRESS);
  const escrow = new PublicKey(CONTRACTS.SOLANA_ESCROW_ADDRESS);

  // Create Anchor instruction using BorshInstructionCoder (handles discriminator automatically)
  const createMintTokenInstruction = async (userPublicKey: PublicKey, userTokenAccount: PublicKey) => {
    // Derive OFT store PDA using the escrow address
    // Based on LayerZero's pattern: oft_store is derived from escrow
    const [oftStore] = PublicKey.findProgramAddressSync(
      [Buffer.from("oft_store"), escrow.toBuffer()],
      programId
    );
    
    // Derive daily mint limit PDA
    const [dailyMintLimit] = PublicKey.findProgramAddressSync(
      [Buffer.from("daily_mint_limit"), oftStore.toBuffer(), userPublicKey.toBuffer()],
      programId
    );

    // Use Anchor's BorshInstructionCoder to properly encode the instruction
    // This automatically handles the discriminator generation!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coder = new BorshInstructionCoder(oftIdl as any);
    const instructionData = coder.encode("mintToken", {}); // Empty args for mintToken

    // Build the accounts array in the order specified by the IDL
    const keys = [
      { pubkey: userPublicKey, isSigner: true, isWritable: true },        // user
      { pubkey: oftStore, isSigner: false, isWritable: false },          // oftStore
      { pubkey: tokenMint, isSigner: false, isWritable: true },          // tokenMint
      { pubkey: dailyMintLimit, isSigner: false, isWritable: true },     // dailyMintLimit
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },   // userTokenAccount
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },  // tokenProgram
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // systemProgram
    ];

    return {
      keys,
      programId,
      data: instructionData,
    };
  };

  // Fetch token balance
  const fetchBalance = async () => {
    if (!wallet.publicKey) return;
    
    setIsLoadingBalance(true);
    setError(null);
    
    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey
      );

      const account = await getAccount(connection, associatedTokenAddress);
      
      // Get mint info to determine decimals
      const mintInfo = await connection.getParsedAccountInfo(tokenMint);
      const decimals = mintInfo.value?.data && 'parsed' in mintInfo.value.data 
        ? mintInfo.value.data.parsed.info.decimals || 6
        : 6;

      setBalance({
        amount: Number(account.amount),
        decimals,
        uiAmount: Number(account.amount) / Math.pow(10, decimals)
      });
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        setBalance({
          amount: 0,
          decimals: 6,
          uiAmount: 0
        });
      } else {
        console.error('Error fetching balance:', error);
        setError('Failed to fetch token balance');
      }
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Create associated token account if needed
  const createAssociatedTokenAccount = async (userPublicKey: PublicKey) => {
    const associatedTokenAddress = await getAssociatedTokenAddress(
      tokenMint,
      userPublicKey
    );

    try {
      // Try to get the account first
      await getAccount(connection, associatedTokenAddress);
      return associatedTokenAddress; // Account exists
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        // Create the account
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            userPublicKey, // payer
            associatedTokenAddress, // associated token account
            userPublicKey, // owner
            tokenMint // mint
          )
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = userPublicKey;

        const signedTransaction = await wallet.signTransaction!(transaction);
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );

        await connection.confirmTransaction(signature, 'confirmed');
        return associatedTokenAddress;
      }
      throw error;
    }
  };

  // Mint tokens using Anchor BorshInstructionCoder (proper discriminator handling)
  const handleMint = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError("Wallet not connected");
      return;
    }

    setIsMinting(true);
    setError(null);

    try {
      // 1. Ensure user has associated token account
      const userTokenAccount = await createAssociatedTokenAccount(wallet.publicKey);
      
      // 2. Create instruction using Anchor's BorshInstructionCoder + LayerZero SDK
      // This automatically generates the correct discriminator!
      const instructionData = await createMintTokenInstruction(wallet.publicKey, userTokenAccount);
      
      // 3. Build and send the transaction
      const transaction = new Transaction().add(instructionData);
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      const signedTransaction = await wallet.signTransaction!(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log("OFT mint transaction completed:", signature);
      
      // Refresh balance after minting
      await fetchBalance();
      
    } catch (error) {
      console.error("Error minting OFT tokens:", error);
      
      // Handle specific OFT program errors
      if (error && typeof error === 'object' && 'logs' in error) {
        const logs = (error as { logs?: string[] }).logs || [];
        const errorLog = logs.find((log: string) => log.includes('Error'));
        if (errorLog) {
          if (errorLog.includes('6009')) {
            setError('Daily mint limit reached. Please try again tomorrow.');
          } else if (errorLog.includes('6008')) {
            setError('Minting is currently paused.');
          } else if (errorLog.includes('6000')) {
            setError('Unauthorized to mint tokens.');
          } else {
            setError(`Program error: ${errorLog}`);
          }
        } else {
          setError('Transaction failed. Please check the console for details.');
        }
      } else {
        setError(error instanceof Error ? error.message : "Failed to mint OFT tokens");
      }
    } finally {
      setIsMinting(false);
    }
  };

  // Fetch balance when wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      fetchBalance();
    }
  }, [wallet.connected, wallet.publicKey]);

  if (!wallet.connected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Solana OFT
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Connect your Solana wallet to view OFT balance and mint tokens.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Solana OFT
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Balance</h4>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLoadingBalance ? 'Loading...' : `${balance.uiAmount.toLocaleString()} OFT`}
            </p>
            <button
              onClick={fetchBalance}
              disabled={isLoadingBalance}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded transition-colors duration-200"
            >
              {isLoadingBalance ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            <span className="font-medium">Mint:</span> 
            <span className="font-mono text-xs ml-1">{CONTRACTS.SOLANA_OFT_MINT_ADDRESS}</span>
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleMint}
            disabled={isMinting}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {isMinting ? 'Minting OFT Tokens...' : 'Mint OFT Tokens'}
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Using LayerZero OFT Program: {CONTRACTS.SOLANA_PROGRAM_ADDRESS}
          </p>
        </div>
      </div>
    </div>
  );
} 