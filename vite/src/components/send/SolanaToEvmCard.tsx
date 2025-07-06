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
  setComputeUnitLimit,
  setComputeUnitPrice,
} from '@metaplex-foundation/mpl-toolbox'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import bs58 from 'bs58';
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { CONTRACTS } from "../../config/contracts";
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

export default function SolanaToEvmCard() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const chainId = useChainId();
  const { address: ethereumAddress, isConnected: isEthereumConnected } = useAccount();

  const [isClient, setIsClient] = useState(false);
  const [amount, setAmount] = useState('0.1');
  const [recipientAddress, setRecipientAddress] = useState('');
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

  // Auto-populate recipient address when Ethereum wallet connects
  useEffect(() => {
    if (isEthereumConnected && ethereumAddress && !recipientAddress) {
      setRecipientAddress(ethereumAddress);
    }
  }, [isEthereumConnected, ethereumAddress, recipientAddress]);

  if (!isClient) return null; // Prevent rendering mismatched content

  // Use the connection from the wallet provider instead of hardcoded RPC
  const umi = createUmi(connection.rpcEndpoint).use(mplToolbox());
  umi.use(walletAdapterIdentity(wallet));

  async function onClickQuote() {
    if (!wallet.connected || !wallet.publicKey) {
      console.error("Solana wallet is not connected or publicKey is missing.");
      return;
    }

    if (!recipientAddress) {
      console.error("Recipient address is required.");
      return;
    }

    const mint = publicKey(CONTRACTS.SOLANA_OFT_MINT_ADDRESS);
    const storePda = publicKey(CONTRACTS.SOLANA_OFT_STORE_ADDRESS);

    // Fetch OFT store information to get the escrow address
    const oftStoreInfo = await oft.accounts.fetchOFTStore(umi, storePda);
    const escrowPk = new PublicKey(oftStoreInfo.tokenEscrow);
    console.log("escrowPk", escrowPk.toBase58());
    
    // Use the recipient address as the destination
    const recipientAddressBytes32 = addressToBytes32(recipientAddress);

    const amountLamports = BigInt(Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL));

    console.log("Using EndpointId:", toEid, "for chainId:", chainId);
    console.log("Destination address:", recipientAddress);

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

    if (!recipientAddress) {
      console.error("Recipient address is required.");
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

      // Use the recipient address as the destination
      const recipientAddressBytes32 = addressToBytes32(recipientAddress);

      console.log("Sending cross-chain OFT transaction...");
      console.log("Source EID: SOLANA_V2_TESTNET");
      console.log("Destination EID:", toEid);
      console.log("Amount:", amountUnits.toString());
      console.log("Native fee:", nativeFee.toString());
      console.log("Destination address:", recipientAddress);

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

      // Create send instruction 
      const sendIx = await oft.send(
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
          minAmountLd: amountUnits,
          options: Buffer.from(""),
          composeMsg: undefined,
          nativeFee: latestNativeFee,
        },
        { 
          oft: programId,
          token: tokenProgramId
        }
      );

      // Build transaction with proper compute budget using LayerZero approach
      console.log("Building LayerZero cross-chain transaction with compute budget...");
      
      // Following the LayerZero script approach for compute units
      const computeUnitLimitScaleFactor = 1.1; // Safety margin as in reference
      const computeUnitPriceScaleFactor = 2.0; // Higher priority for cross-chain
      
      // Estimate compute units needed (based on LayerZero script estimates)
      const estimatedComputeUnits = 230_000; // From TransactionCuEstimates.SendOFT
      const computeUnits = Math.floor(estimatedComputeUnits * computeUnitLimitScaleFactor);
      
      // Use a reasonable priority fee (in micro-lamports)
      const priorityFee = 100_000; // 0.1 lamports per CU
      const computeUnitPrice = BigInt(Math.floor(priorityFee * computeUnitPriceScaleFactor));

      // Create compute budget instructions using mpl-toolbox (same as LayerZero script)
      const setComputeUnitPriceIx = setComputeUnitPrice(umi, {
        microLamports: computeUnitPrice,
      });

      const setComputeUnitLimitIx = setComputeUnitLimit(umi, {
        units: computeUnits,
      });

      // Build transaction following LayerZero pattern: compute budget first, then main instruction
      const txB = transactionBuilder()
        .add(setComputeUnitPriceIx)
        .add(setComputeUnitLimitIx)
        .add(sendIx);
      
      console.log("Sending LayerZero cross-chain transaction...");
      console.log("Compute unit limit:", computeUnits);
      console.log("Compute unit price:", computeUnitPrice.toString(), "micro-lamports");
      console.log("Estimated priority fee:", (Number(computeUnitPrice) * computeUnits / 1_000_000).toFixed(6), "SOL");
      
      const { signature } = await txB.sendAndConfirm(umi, {
        confirm: { commitment: "confirmed" },
        send: { skipPreflight: true } // Skip preflight to avoid simulation errors
      });

      const txHash = bs58.encode(signature);

      console.log("Cross-chain OFT transaction sent:", txHash);
      setSendState({ isLoading: false, txHash, error: null });

    } catch (error) {
      console.error("Cross-chain OFT send failed:", error);
      
      let errorMessage = "Unknown error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide specific guidance for common LayerZero errors
        if (errorMessage.includes("InsufficientFee")) {
          errorMessage = "Insufficient fee error. This may be due to fee fluctuations or high network congestion. Try again or increase your SOL balance.";
        } else if (errorMessage.includes("exceeded CUs meter") || errorMessage.includes("compute units")) {
          errorMessage = "Transaction exceeded compute unit limit. LayerZero cross-chain transactions require high compute units. You may need to use a wallet that supports custom compute unit limits or try during less congested periods.";
        }
      }
      
      setSendState({ 
        isLoading: false, 
        txHash: null, 
        error: errorMessage
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
    <div>
      <div className="space-y-4 mb-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-layerzero-white mb-2">
              Amount to Send
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              className="lz-input w-full"
              placeholder="Enter amount"
              disabled={sendState.isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-layerzero-white mb-2">
              Recipient Address ({getNetworkName(chainId)})
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="lz-input w-full"
              placeholder="Enter Ethereum address"
              disabled={sendState.isLoading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onClickQuote}
          className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!wallet.connected || !wallet.publicKey || !amount || !recipientAddress || sendState.isLoading}
        >
          Get Quote
        </button>

        {nativeFee !== null && (
          <button 
            onClick={onClickSend}
            className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!wallet.connected || !wallet.publicKey || !amount || !recipientAddress || sendState.isLoading || nativeFee === null}
          >
            {sendState.isLoading ? "Sending..." : "Send OFT"}
          </button>
        )}
      </div>

      {!recipientAddress && (
        <div className="mt-4 p-3 bg-layerzero-gray-800 border border-yellow-400 rounded-none">
          <p className="text-sm text-yellow-400">
            Please enter a recipient address for the destination network.
          </p>
        </div>
      )}

      {nativeFee !== null && (
        <div className="mt-6 p-4 bg-layerzero-gray-800 border border-green-400 rounded-none">
          <p className="text-sm text-green-400">
            <span className="font-medium">Quote Result (Native Fee):</span> {nativeFee.toString()}
          </p>
        </div>
      )}

      {sendState.error && (
        <div className="mt-4 p-3 bg-layerzero-gray-800 border border-red-400 rounded-none">
          <p className="text-sm text-red-400">
            <span className="font-medium">Error:</span> {sendState.error}
          </p>
        </div>
      )}

      {sendState.txHash && (
        <div className="mt-4 p-3 bg-layerzero-gray-800 border border-blue-400 rounded-none">
          <p className="text-sm text-blue-400">
            <span className="font-medium">Transaction Hash:</span> 
            <span className="font-mono text-xs ml-2">{sendState.txHash}</span>
          </p>
          <div className="flex gap-4 mt-2">
            <a 
              href={`https://solscan.io/tx/${sendState.txHash}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 underline hover:no-underline"
            >
              View on Solscan
            </a>
            <a 
              href={`https://testnet.layerzeroscan.com/tx/${sendState.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 underline hover:no-underline"
            >
              View on LayerZero Scan
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
