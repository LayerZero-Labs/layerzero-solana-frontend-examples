"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { publicKey, transactionBuilder } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { oft } from "@layerzerolabs/oft-v2-solana-sdk";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAppKitAccount } from "@reown/appkit/react";
import { toWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";

const SEPOLIA_OFT_ADDRESS = process.env.NEXT_PUBLIC_SEPOLIA_OFT_ADDRESS;
const SOLANA_OFT_MINT_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_OFT_MINT_ADDRESS;
const SEPOLIA_WALLET = process.env.NEXT_PUBLIC_SEPOLIA_WALLET; // TODO: unhardcode, use address from reown/appkit

const amount = 0.1 * LAMPORTS_PER_SOL;

const SOLANA_ESCROW_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_ESCROW_ADDRESS;
const SOLANA_PROGRAM_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ADDRESS;

const fromEid = EndpointId.SOLANA_V2_TESTNET;
const toEid = EndpointId.SEPOLIA_V2_TESTNET;

export const OftQuote = () => {
  const [isClient, setIsClient] = useState(false);
  const [nativeFee, setNativeFee] = useState<bigint | null>(null);

  useEffect(() => {
    setIsClient(true); // Set to true when component mounts (client-side)
  }, []);

  const appKitAccount = useAppKitAccount();
  const { isConnected, allAccounts } = appKitAccount;
  const solanaAddress = allAccounts.find(account => account.namespace === 'solana')?.address

  if (!isClient) return null; // Prevent rendering mismatched content

  const rpcUrl = "https://api.devnet.solana.com";
  const umi = createUmi(rpcUrl);


  if (!solanaAddress) {
    return null;
  }

  umi.use(walletAdapterIdentity({ publicKey: toWeb3JsPublicKey(publicKey(solanaAddress)) }))

  async function onClickQuote() {
    if (!isConnected || !solanaAddress) {
      console.error("Wallet is not connected or address is missing.");
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
        payer: publicKey(solanaAddress),
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
      <p>Quote result (nativeFee): {nativeFee}</p>
      <button onClick={onClickQuote}>OFT Quote</button>
    </div>
  );
};
