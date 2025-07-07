import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { clusterApiUrl } from "@solana/web3.js";

// Use environment variable or default to devnet to match contract deployment
const endpoint = import.meta.env.VITE_SOLANA_RPC_ENDPOINT || clusterApiUrl('devnet');

// Create a stable UMI instance that can be reused
export const umi = createUmi(endpoint).use(mplToolbox());

// Export the endpoint for reference
export const rpcEndpoint = endpoint; 