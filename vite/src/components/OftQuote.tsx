"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { oft } from "@layerzerolabs/oft-v2-solana-sdk";
import { useState, useEffect } from "react";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const SEPOLIA_OFT_ADDRESS = import.meta.env.VITE_SEPOLIA_OFT_ADDRESS;
const SOLANA_OFT_MINT_ADDRESS = import.meta.env.VITE_SOLANA_OFT_MINT_ADDRESS;
const SEPOLIA_WALLET = import.meta.env.VITE_SEPOLIA_WALLET; // TODO: unhardcode, use address from reown/appkit

const amount = 0.1 * LAMPORTS_PER_SOL;

const SOLANA_ESCROW_ADDRESS = import.meta.env.VITE_SOLANA_ESCROW_ADDRESS;
const SOLANA_PROGRAM_ADDRESS = import.meta.env.VITE_SOLANA_PROGRAM_ADDRESS;

const toEid = EndpointId.SEPOLIA_V2_TESTNET;

export default function OftQuote() {
  const wallet = useWallet();

  const [isClient, setIsClient] = useState(false);
  const [nativeFee, setNativeFee] = useState<bigint | null>(null);

  useEffect(() => {
    setIsClient(true); // Set to true when component mounts (client-side)
  }, []);

  if (!isClient) return null; // Prevent rendering mismatched content

  const rpcUrl = "https://api.devnet.solana.com";
  const umi = createUmi(rpcUrl);
  umi.use(walletAdapterIdentity(wallet));

  async function onClickQuote() {
    if (!wallet.connected || !wallet.publicKey) {
      console.error("Wallet is not connected or publicKey is missing.");
      return;
    }

    if (
      !SEPOLIA_OFT_ADDRESS ||
      !SOLANA_OFT_MINT_ADDRESS ||
      !SEPOLIA_WALLET ||
      !SOLANA_ESCROW_ADDRESS ||
      !SOLANA_PROGRAM_ADDRESS
    ) {
      console.error("Missing environment variables.");
      return;
    }

    const mint = publicKey(SOLANA_OFT_MINT_ADDRESS);

    const recipientAddressBytes32 = addressToBytes32(SEPOLIA_WALLET);

    const { nativeFee } = await oft.quote(
      umi.rpc,
      {
        payer: publicKey(wallet.publicKey),
        tokenMint: mint,
        tokenEscrow: publicKey(SOLANA_ESCROW_ADDRESS),
      },
      {
        payInLzToken: false,
        to: Buffer.from(recipientAddressBytes32),
        dstEid: toEid,
        amountLd: BigInt(amount),
        minAmountLd: 1n,
        options: Buffer.from(""), // enforcedOptions must have been set
        composeMsg: undefined,
      },
      {
        oft: publicKey(SOLANA_PROGRAM_ADDRESS),
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
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contract Addresses</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Sepolia OFT:</span> <span className="font-bold">{SEPOLIA_OFT_ADDRESS}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Solana OFT Mint:</span> <span className="font-bold">{SOLANA_OFT_MINT_ADDRESS}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Solana Escrow:</span> <span className="font-bold">{SOLANA_ESCROW_ADDRESS}</span>
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Addresses</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Sepolia (Hardcoded):</span> <span className="font-bold">{SEPOLIA_WALLET}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Connected Solana:</span> <span className="font-bold">{wallet.publicKey?.toBase58()}</span>
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Amount (Hardcoded):</span> {amount}
          </p>
        </div>
      </div>

      <button 
        onClick={onClickQuote}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!wallet.connected || !wallet.publicKey}
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
