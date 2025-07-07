import { EndpointId } from "@layerzerolabs/lz-definitions";

/**
 * Mapping of chain IDs to LayerZero Endpoint IDs
 */
const CHAIN_ID_TO_ENDPOINT_ID: Record<number, number> = {
  11155420: EndpointId.OPTSEP_V2_TESTNET, // OP Sepolia
  11155111: EndpointId.SEPOLIA_V2_TESTNET, // Sepolia
  // Add more mappings as needed
};

/**
 * Mapping of chain IDs to human-readable network names
 */
const CHAIN_ID_TO_NETWORK_NAME: Record<number, string> = {
  11155420: "OP Sepolia",
  11155111: "Sepolia",
};

/**
 * Convert chainId to LayerZero EndpointId
 */
export function getEndpointIdFromChainId(chainId: number): number {
  return CHAIN_ID_TO_ENDPOINT_ID[chainId] || EndpointId.OPTSEP_V2_TESTNET; // Default to OP Sepolia
}

/**
 * Get the network name based on chainId
 */
export function getNetworkName(chainId: number): string {
  return CHAIN_ID_TO_NETWORK_NAME[chainId] || "Unknown Network";
}

/**
 * Check if a chain ID is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return chainId in CHAIN_ID_TO_ENDPOINT_ID;
}

/**
 * Get all supported chain IDs
 */
export function getSupportedChainIds(): number[] {
  return Object.keys(CHAIN_ID_TO_ENDPOINT_ID).map(Number);
} 