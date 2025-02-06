"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { oft } from "@layerzerolabs/oft-v2-solana-sdk";
import { useState, useEffect } from "react";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { publicKey, transactionBuilder } from "@metaplex-foundation/umi";
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

const fromEid = EndpointId.SOLANA_V2_TESTNET;
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
    <div>
      <div />

      <p>Sepolia OFT Token Contract Address: {SEPOLIA_OFT_ADDRESS}</p>
      <p>Solana OFT Mint Address: {SOLANA_OFT_MINT_ADDRESS}</p>
      <p>Solana Escrow Address: {SOLANA_ESCROW_ADDRESS}</p>

      <div />

      <p>(Harcoded) Sepolia address: {SEPOLIA_WALLET}</p>
      <p>Connected Solana address: {wallet.publicKey?.toBase58()} </p>

      <div />

      <p>(Hardcoded) Amount: {amount}</p>

      <button onClick={onClickQuote}>OFT Quote</button>

      <p>Quote result (nativeFee): {nativeFee ? nativeFee.toString() : "null"}</p>
    </div>
  );
}
