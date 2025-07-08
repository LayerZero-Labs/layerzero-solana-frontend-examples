import { useState, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { optimismSepolia } from 'wagmi/chains'
import { isSupportedEvmChain, getTargetEvmChain, processEvmError } from '../../utils/oft'

interface UseEvmBaseOptions {
  networkCheck?: 'optimism-sepolia' | 'supported-chains'
}

export function useEvmBase(options: UseEvmBaseOptions = {}) {
  const { networkCheck = 'supported-chains' } = options
  
  // Wagmi hooks
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Error state
  const [error, setError] = useState<string | null>(null)

  // Network checking based on options
  const isCorrectNetwork = networkCheck === 'optimism-sepolia' 
    ? chainId === optimismSepolia.id
    : isSupportedEvmChain(chainId)

  // Network switching
  const handleSwitchNetwork = useCallback(() => {
    const targetChainId = networkCheck === 'optimism-sepolia' 
      ? optimismSepolia.id
      : getTargetEvmChain().id
    
    switchChain({ chainId: targetChainId })
  }, [switchChain, networkCheck])

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
    chainId,
    
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