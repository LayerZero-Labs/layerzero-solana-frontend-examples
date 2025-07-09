import { Umi, publicKey, transactionBuilder } from "@metaplex-foundation/umi";
import { oft } from "@layerzerolabs/oft-v2-solana-sdk";
import { addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import {
  fetchMint,
  fetchToken, 
  findAssociatedTokenPda,
  setComputeUnitLimit,
  setComputeUnitPrice,
} from '@metaplex-foundation/mpl-toolbox'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import bs58 from 'bs58';

interface QuoteParams {
  umi: Umi;
  contractValues: {
    mint: ReturnType<typeof fromWeb3JsPublicKey>;
    storePda: ReturnType<typeof publicKey>;
    programId: ReturnType<typeof publicKey>;
  };
  walletPublicKey: string;
  recipientAddress: string;
  amount: string;
  toEid: number;
}

interface SendTransactionParams extends QuoteParams {
  nativeFee: bigint;
}

interface TransactionSetup {
  oftStoreInfo: Awaited<ReturnType<typeof oft.accounts.fetchOFTStore>>;
  mintPk: PublicKey;
  escrowPk: PublicKey;
  tokenAccount: ReturnType<typeof findAssociatedTokenPda>;
  balance: bigint;
  decimals: number;
  amountUnits: bigint;
  recipientAddressBytes32: Uint8Array;
}

/**
 * Get a quote for sending OFT tokens cross-chain
 */
export async function getSolanaOftQuote(params: QuoteParams): Promise<bigint> {
  const { umi, contractValues, walletPublicKey, recipientAddress, amount, toEid } = params;

  console.log("📊 Network request 1: fetchOFTStore");
  
  // Fetch OFT store information to get the escrow address
  const oftStoreInfo = await oft.accounts.fetchOFTStore(umi, contractValues.storePda);
  const escrowPk = new PublicKey(oftStoreInfo.tokenEscrow);
  console.log("escrowPk", escrowPk.toBase58());
  
  console.log("📊 Network request 2: oft.quote");
  
  // Use the recipient address as the destination
  const recipientAddressBytes32 = addressToBytes32(recipientAddress);
  const amountLamports = BigInt(Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL));

  const { nativeFee } = await oft.quote(
    umi.rpc,
    {
      payer: publicKey(walletPublicKey),
      tokenMint: contractValues.mint,
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
      oft: contractValues.programId,
    }
  );
  
  return nativeFee;
}

/**
 * Setup transaction accounts and validate balances
 */
export async function setupSolanaOftTransaction(params: SendTransactionParams): Promise<TransactionSetup> {
  const { umi, contractValues, walletPublicKey, recipientAddress, amount } = params;

  // Fetch OFT store information
  const oftStoreInfo = await oft.accounts.fetchOFTStore(umi, contractValues.storePda);
  const mintPk = new PublicKey(oftStoreInfo.tokenMint);
  const escrowPk = new PublicKey(oftStoreInfo.tokenEscrow);

  // Set up token program
  const tokenProgramId = fromWeb3JsPublicKey(TOKEN_PROGRAM_ID);

  // Find associated token account
  const tokenAccount = findAssociatedTokenPda(umi, {
    mint: fromWeb3JsPublicKey(mintPk),
    owner: publicKey(walletPublicKey),
    tokenProgramId,
  });

  if (!tokenAccount) {
    throw new Error(`No token account found for mint ${mintPk}`);
  }

  // Check balance and get decimals
  const balance = (await fetchToken(umi, tokenAccount)).amount;
  const decimals = (await fetchMint(umi, fromWeb3JsPublicKey(mintPk))).decimals;
  
  // Convert amount using proper decimal handling
  const amountUnits = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)));

  if (amountUnits === 0n || amountUnits > balance) {
    throw new Error(`Insufficient balance (need ${amountUnits}, have ${balance})`);
  }

  // Use the recipient address as the destination
  const recipientAddressBytes32 = addressToBytes32(recipientAddress);

  return {
    oftStoreInfo,
    mintPk,
    escrowPk,
    tokenAccount,
    balance,
    decimals,
    amountUnits,
    recipientAddressBytes32,
  };
}

/**
 * Create compute budget instructions for LayerZero transactions
 */
export function createSolanaComputeBudgetInstructions(umi: Umi) {
  // Following the LayerZero script approach for compute units
  const computeUnitLimitScaleFactor = 1.1; // Safety margin
  const computeUnitPriceScaleFactor = 2.0; // Higher priority for cross-chain
  
  // Estimate compute units needed (based on LayerZero script estimates)
  const estimatedComputeUnits = 230_000; // From TransactionCuEstimates.SendOFT
  const computeUnits = Math.floor(estimatedComputeUnits * computeUnitLimitScaleFactor);
  
  // Use a reasonable priority fee (in micro-lamports)
  const priorityFee = 100_000; // 0.1 lamports per CU
  const computeUnitPrice = BigInt(Math.floor(priorityFee * computeUnitPriceScaleFactor));

  // Create compute budget instructions
  const setComputeUnitPriceIx = setComputeUnitPrice(umi, {
    microLamports: computeUnitPrice,
  });

  const setComputeUnitLimitIx = setComputeUnitLimit(umi, {
    units: computeUnits,
  });

  console.log("Compute unit limit:", computeUnits);
  console.log("Compute unit price:", computeUnitPrice.toString(), "micro-lamports");
  console.log("Estimated priority fee:", (Number(computeUnitPrice) * computeUnits / 1_000_000).toFixed(6), "SOL");

  return {
    setComputeUnitPriceIx,
    setComputeUnitLimitIx,
    computeUnits,
    computeUnitPrice,
  };
}

/**
 * Send OFT tokens cross-chain
 */
export async function sendSolanaOftTransaction(params: SendTransactionParams): Promise<string> {
  const { umi, contractValues, toEid, nativeFee } = params;

  console.log("Starting send transaction...");

  // Setup transaction accounts and validate
  const setup = await setupSolanaOftTransaction(params);
  const { mintPk, escrowPk, tokenAccount, amountUnits, recipientAddressBytes32 } = setup;

  console.log("Sending cross-chain OFT transaction...");
  console.log("Source EID: SOLANA_V2_TESTNET");
  console.log("Destination EID:", toEid);
  console.log("Amount:", amountUnits.toString());
  console.log("Native fee:", nativeFee.toString());
  console.log("Destination address:", params.recipientAddress);

  // Re-quote to ensure we have the latest fee
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
      oft: contractValues.programId,
    }
  );

  // Create send instruction
  const tokenProgramId = fromWeb3JsPublicKey(TOKEN_PROGRAM_ID);
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
      oft: contractValues.programId,
      token: tokenProgramId
    }
  );

  // Build transaction with compute budget
  console.log("Building LayerZero cross-chain transaction with compute budget...");
  const { setComputeUnitPriceIx, setComputeUnitLimitIx } = createSolanaComputeBudgetInstructions(umi);

  // Build transaction following LayerZero pattern
  const txB = transactionBuilder()
    .add(setComputeUnitPriceIx)
    .add(setComputeUnitLimitIx)
    .add(sendIx);
  
  console.log("Sending LayerZero cross-chain transaction...");
  
  const { signature } = await txB.sendAndConfirm(umi, {
    confirm: { commitment: "confirmed" },
    send: { skipPreflight: true } // Skip preflight to avoid simulation errors
  });

  return bs58.encode(signature);
}

/**
 * Process LayerZero-specific error messages
 */
export function processSolanaLayerZeroError(error: unknown): string {
  let errorMessage = "Unknown error occurred";
  
  if (error instanceof Error) {
    errorMessage = error.message;
    
    if (errorMessage.includes("InsufficientFee")) {
      errorMessage = "Insufficient fee error. Are you calling 'quoteSend' correctly?";
    } else if (errorMessage.includes("exceeded CUs meter") || errorMessage.includes("compute units")) {
      errorMessage = "Transaction exceeded compute unit limit. ";
    }
  }
  
  return errorMessage;
} 