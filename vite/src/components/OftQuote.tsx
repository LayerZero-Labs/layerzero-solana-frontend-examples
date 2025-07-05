"use client";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useChainId, useAccount } from "wagmi";
import { oft } from "@layerzerolabs/oft-v2-solana-sdk";
import { useState, useEffect } from "react";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { publicKey, transactionBuilder } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  mplToolbox,
  fetchMint,
  fetchToken, 
  findAssociatedTokenPda,
} from '@metaplex-foundation/mpl-toolbox'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import bs58 from 'bs58';
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { CONTRACTS } from "../config/contracts";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// Mapper function to convert chainId to EndpointId
const getEndpointIdFromChainId = (chainId: number): number => {
  const chainIdToEndpointId: Record<number, number> = {
    11155420: EndpointId.OPTSEP_V2_TESTNET, // OP Sepolia
    11155111: EndpointId.SEPOLIA_V2_TESTNET, // Sepolia
    // Add more mappings as needed
  };
  
  return chainIdToEndpointId[chainId] || EndpointId.OPTSEP_V2_TESTNET; // Default to OP Sepolia
};

interface SendState {
  isLoading: boolean;
  txHash: string | null;
  error: string | null;
}

export default function OftQuote() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const chainId = useChainId();
  const { address: ethereumAddress, isConnected: isEthereumConnected } = useAccount();

  const [isClient, setIsClient] = useState(false);
  const [amount, setAmount] = useState('0.1');
  const [nativeFee, setNativeFee] = useState<bigint | null>(null);
  const [sendState, setSendState] = useState<SendState>({
    isLoading: false,
    txHash: null,
    error: null
  });

  // Get the appropriate EndpointId based on the connected ethereum wallet's chainId
  const toEid = getEndpointIdFromChainId(chainId);

  useEffect(() => {
    setIsClient(true); // Set to true when component mounts (client-side)
  }, []);

  if (!isClient) return null; // Prevent rendering mismatched content

  // Use the connection from the wallet provider instead of hardcoded RPC
  const umi = createUmi(connection.rpcEndpoint).use(mplToolbox());
  umi.use(walletAdapterIdentity(wallet));

  async function onClickQuote() {
    if (!wallet.connected || !wallet.publicKey) {
      console.error("Solana wallet is not connected or publicKey is missing.");
      return;
    }

    if (!isEthereumConnected || !ethereumAddress) {
      console.error("Ethereum wallet is not connected or address is missing.");
      return;
    }

    const mint = publicKey(CONTRACTS.SOLANA_OFT_MINT_ADDRESS);
    const storePda = publicKey(CONTRACTS.SOLANA_OFT_STORE_ADDRESS);

    // Fetch OFT store information to get the escrow address
    const oftStoreInfo = await oft.accounts.fetchOFTStore(umi, storePda);
    const escrowPk = new PublicKey(oftStoreInfo.tokenEscrow);
    console.log("escrowPk", escrowPk.toBase58());
    
    // Use the connected ethereum wallet address as the destination
    const recipientAddressBytes32 = addressToBytes32(ethereumAddress);

    const amountLamports = BigInt(Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL));

    console.log("Using EndpointId:", toEid, "for chainId:", chainId);
    console.log("Destination address:", ethereumAddress);

    const { nativeFee } = await oft.quote(
      umi.rpc,
      {
        payer: publicKey(wallet.publicKey),
        tokenMint: mint,
        tokenEscrow: publicKey(escrowPk),
      },
      {
        payInLzToken: false,
        to: Buffer.from(recipientAddressBytes32),
        dstEid: toEid,
        amountLd: amountLamports,
        minAmountLd: 1n,
        options: Buffer.from(""), // enforcedOptions must have been set
        composeMsg: undefined,
      },
      {
        oft: publicKey(CONTRACTS.SOLANA_PROGRAM_ADDRESS),
      }
    );
    setNativeFee(nativeFee);
  }

  async function onClickSend() {
    if (!wallet.connected || !wallet.publicKey) {
      console.error("Solana wallet is not connected or publicKey is missing.");
      return;
    }

    if (!isEthereumConnected || !ethereumAddress) {
      console.error("Ethereum wallet is not connected or address is missing.");
      return;
    }

    if (nativeFee === null) {
      console.error("No quote available. Please get a quote first.");
      return;
    }

    setSendState({ isLoading: true, txHash: null, error: null });

    try {
      const storePda = publicKey(CONTRACTS.SOLANA_OFT_STORE_ADDRESS);
      const programId = publicKey(CONTRACTS.SOLANA_PROGRAM_ADDRESS);

      // Fetch OFT store information
      const oftStoreInfo = await oft.accounts.fetchOFTStore(umi, storePda);
      const mintPk = new PublicKey(oftStoreInfo.tokenMint);
      const escrowPk = new PublicKey(oftStoreInfo.tokenEscrow);

      // Set up token program (matching reference code)
      const tokenProgramId = fromWeb3JsPublicKey(TOKEN_PROGRAM_ID);

      // Find associated token account with explicit token program
      const tokenAccount = findAssociatedTokenPda(umi, {
        mint: fromWeb3JsPublicKey(mintPk),
        owner: publicKey(wallet.publicKey),
        tokenProgramId,
      });

      if (!tokenAccount) {
        throw new Error(`No token account found for mint ${mintPk}`);
      }

      // Check balance and get decimals
      const balance = (await fetchToken(umi, tokenAccount)).amount;
      const decimals = (await fetchMint(umi, fromWeb3JsPublicKey(mintPk))).decimals;
      
      // Convert amount using proper decimal handling (matching reference parseDecimalToUnits)
      const amountUnits = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)));

      if (amountUnits === 0n || amountUnits > balance) {
        throw new Error(`Insufficient balance (need ${amountUnits}, have ${balance})`);
      }

      // Use the connected ethereum wallet address as the destination
      const recipientAddressBytes32 = addressToBytes32(ethereumAddress);

      console.log("Sending cross-chain OFT transaction...");
      console.log("Source EID: SOLANA_V2_TESTNET");
      console.log("Destination EID:", toEid);
      console.log("Amount:", amountUnits.toString());
      console.log("Native fee:", nativeFee.toString());
      console.log("Destination address:", ethereumAddress);

      // Re-quote to ensure we have the latest fee (sometimes fees can change)
      console.log("Re-quoting to ensure latest fee...");
      const { nativeFee: latestNativeFee } = await oft.quote(
        umi.rpc,
        {
          payer: umi.identity.publicKey,
          tokenMint: fromWeb3JsPublicKey(mintPk),
          tokenEscrow: fromWeb3JsPublicKey(escrowPk),
        },
        {
          payInLzToken: false,
          to: Buffer.from(recipientAddressBytes32),
          dstEid: toEid,
          amountLd: amountUnits,
          minAmountLd: amountUnits,
          options: Buffer.from(""),
          composeMsg: undefined,
        },
        {
          oft: programId,
        }
      );

      console.log("Latest native fee:", latestNativeFee.toString());

      // Create send instruction (matching reference structure)
      const ix = await oft.send(
        umi.rpc,
        {
          payer: umi.identity,
          tokenMint: fromWeb3JsPublicKey(mintPk),
          tokenEscrow: fromWeb3JsPublicKey(escrowPk),
          tokenSource: tokenAccount[0],
        },
        {
          to: Buffer.from(recipientAddressBytes32),
          dstEid: toEid,
          amountLd: amountUnits,
          minAmountLd: amountUnits, // Use same as amount for simplicity, could be configurable
          options: Buffer.from(""), // Could be enhanced to support extraOptions
          composeMsg: undefined, // Could be enhanced to support compose messages
          nativeFee: latestNativeFee, // Use the latest fee
        },
        { 
          oft: programId,
          token: tokenProgramId // Include token program as in reference
        }
      );

      // Build and send transaction with re-quoted fee
      const txB = transactionBuilder().add([ix]);
      
      console.log("Sending cross-chain transaction...");
      
      const { signature } = await txB.sendAndConfirm(umi, {
        confirm: { commitment: "confirmed" },
      });

      const txHash = bs58.encode(signature);

      console.log("Cross-chain OFT transaction sent:", txHash);
      setSendState({ isLoading: false, txHash, error: null });

    } catch (error) {
      console.error("Cross-chain OFT send failed:", error);
      setSendState({ 
        isLoading: false, 
        txHash: null, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      });
    }
  }

  // Get the network name based on chainId
  const getNetworkName = (chainId: number): string => {
    const networkNames: Record<number, string> = {
      11155420: "OP Sepolia",
      11155111: "Sepolia",
    };
    return networkNames[chainId] || "Unknown Network";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Solana → EVM Transfer
      </h2>

      <div className="space-y-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Transfer Details</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Destination ({getNetworkName(chainId)}):</span> <span className="font-mono text-xs">{ethereumAddress || 'No Ethereum wallet connected'}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            <span className="font-medium">Destination Endpoint ID:</span> {toEid}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount to Send
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter amount"
            disabled={sendState.isLoading}
          />
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onClickQuote}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!wallet.connected || !wallet.publicKey || !amount || !isEthereumConnected || !ethereumAddress || sendState.isLoading}
        >
          Get OFT Quote
        </button>

        {nativeFee !== null && (
          <button 
            onClick={onClickSend}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!wallet.connected || !wallet.publicKey || !amount || !isEthereumConnected || !ethereumAddress || sendState.isLoading || nativeFee === null}
          >
            {sendState.isLoading ? "Sending..." : "Send OFT"}
          </button>
        )}
      </div>

      {!isEthereumConnected && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Please connect your Ethereum wallet to set the destination address.
          </p>
        </div>
      )}

      {nativeFee !== null && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            <span className="font-medium">Quote Result (Native Fee):</span> {nativeFee.toString()}
          </p>
        </div>
      )}

      {sendState.error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            <span className="font-medium">Error:</span> {sendState.error}
          </p>
        </div>
      )}

      {sendState.txHash && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-medium">Transaction Hash:</span> 
            <span className="font-mono text-xs ml-2">{sendState.txHash}</span>
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
            <a 
              href={`https://explorer.solana.com/tx/${sendState.txHash}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              View on Solana Explorer
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
