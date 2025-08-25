import { useMemo } from "react";
import { getEndpointIdFromChainId, getNetworkName, isSupportedChain, getSupportedChainIds } from "../../utils/network";

// Re-export non-React utilities for backward compatibility
export { getEndpointIdFromChainId, getNetworkName, isSupportedChain, getSupportedChainIds };

/**
 * Hook to get stable endpoint ID for a chain ID
 */
export function useEndpointId(chainId: number) {
  return useMemo(() => {
    return getEndpointIdFromChainId(chainId);
  }, [chainId]);
} 