"use client";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { oft } from "@layerzerolabs/oft-v2-solana-sdk";
import { useState, useEffect } from "react";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { CONTRACTS } from "../config/contracts";

const toEid = EndpointId.SEPOLIA_V2_TESTNET;

export default function OftQuote() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [isClient, setIsClient] = useState(false);
  const [amount, setAmount] = useState('0.1');
  const [nativeFee, setNativeFee] = useState<bigint | null>(null);

  useEffect(() => {
    setIsClient(true); // Set to true when component mounts (client-side)
  }, []);

  if (!isClient) return null; // Prevent rendering mismatched content

  // Use the connection from the wallet provider instead of hardcoded RPC
  const umi = createUmi(connection.rpcEndpoint);
  umi.use(walletAdapterIdentity(wallet));

  async function onClickQuote() {
    if (!wallet.connected || !wallet.publicKey) {
      console.error("Wallet is not connected or publicKey is missing.");
      return;
    }

    const mint = publicKey(CONTRACTS.SOLANA_OFT_MINT_ADDRESS);
    const storePda = publicKey(CONTRACTS.SOLANA_OFT_STORE_ADDRESS);

    // Fetch OFT store information to get the escrow address
    const oftStoreInfo = await oft.accounts.fetchOFTStore(umi, storePda);
    const escrowPk = new PublicKey(oftStoreInfo.tokenEscrow);
    console.log("escrowPk", escrowPk.toBase58());
    const recipientAddressBytes32 = addressToBytes32(CONTRACTS.SEPOLIA_WALLET);

    const amountLamports = BigInt(Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL));

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Solana → EVM Transfer
      </h2>

      <div className="space-y-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Transfer Details</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Destination (OP Sepolia):</span> <span className="font-mono text-xs">{CONTRACTS.SEPOLIA_WALLET}</span>
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
          />
        </div>
      </div>

      <button 
        onClick={onClickQuote}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!wallet.connected || !wallet.publicKey || !amount}
      >
        Get OFT Quote
      </button>

      {nativeFee !== null && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            <span className="font-medium">Quote Result (Native Fee):</span> {nativeFee.toString()}
          </p>
        </div>
      )}
    </div>
  );
}
