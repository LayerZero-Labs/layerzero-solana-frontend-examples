import { useState, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { optimismSepolia } from 'wagmi/chains'
import { processEvmError } from '../../utils/oft'

// Hardcoded supported EVM networks (global, app-wide)
const supportedEvmNetworks = [optimismSepolia];
const singleSupportedNetwork = supportedEvmNetworks[0];

export function useEvmBase() {
  // Wagmi hooks
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Use window.ethereum.chainId if available, otherwise fallback to wagmi's useChainId
  let actualChainId: number | null = null;
  if (window?.ethereum?.chainId) {
    try {
      actualChainId = parseInt(window.ethereum.chainId, 16);
    } catch {
      actualChainId = null;
    }
  }
  if (!actualChainId) actualChainId = isConnected ? chainId : optimismSepolia.id;

  // Find out if your current chain is one you support
  const isSupported = supportedEvmNetworks.some(net => net.id === actualChainId);

  // Flag “wrong network” when connected but not in that list
  const isWrongNetwork = isConnected && !isSupported;

  // go from actualChainId to network
  const network = supportedEvmNetworks.find(n => n.id === actualChainId);
  const networkName = network?.name ?? singleSupportedNetwork.name;

  // Error state
  const [error, setError] = useState<string | null>(null)

  // Network is correct if it's in the supported list
  const isCorrectNetwork = isSupported;

  // Network switching (always to the first supported network)
  const handleSwitchNetwork = useCallback(() => {
    const targetChainId = singleSupportedNetwork.id;
    switchChain({ chainId: targetChainId })
  }, [switchChain])

  // Common error handling
  const handleError = useCallback((error: unknown, fallbackMessage: string) => {
    console.error(fallbackMessage, error)
    const errorMessage = processEvmError ? processEvmError(error) : fallbackMessage
    setError(errorMessage)
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // Wallet state
    address,
    isConnected,
    
    // Network state
    isCorrectNetwork,
    chainId: actualChainId,
    isSupported,
    isWrongNetwork,
    network,
    networkName,
    supportedEvmNetworks,
    singleSupportedNetwork,
    
    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    
    // Error state
    error,
    setError,
    clearError,
    
    // Actions
    writeContract,
    handleSwitchNetwork,
    handleError,
  }
} 