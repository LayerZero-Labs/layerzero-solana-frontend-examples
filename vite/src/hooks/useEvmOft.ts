import { useReadContract } from 'wagmi'
import { useEffect, useCallback } from 'react'
import { myOftMockAbi } from '../vm-artifacts/evm/MyOFTMock'
import { 
  formatTokenBalance, 
  getEvmOftContracts, 
  getMintParameters 
} from '../utils/oft'
import { useEvmBase } from './utils'

export function useEvmOft() {
  const evmBase = useEvmBase({ networkCheck: 'supported-chains' })
  const { address, isConnected, isCorrectNetwork, chainId, hash, isPending, isConfirming, isConfirmed, error, writeContract, handleSwitchNetwork, handleError } = evmBase

  const contracts = getEvmOftContracts()

  // Read user's token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: contracts.sepoliaOft,
    abi: myOftMockAbi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: { enabled: !!address }
  })

  // Format balance for display
  const formattedBalance = formatTokenBalance(balance)

  // Handle mint operation
  const handleMint = useCallback(async () => {
    if (!address || !isCorrectNetwork) return

    evmBase.clearError()
    try {
      const mintParams = getMintParameters(address, '1')
      writeContract({
        address: mintParams.address,
        abi: myOftMockAbi,
        functionName: mintParams.functionName,
        args: mintParams.args,
      })
    } catch (error) {
      handleError(error, 'Error minting')
    }
  }, [address, isCorrectNetwork, writeContract, evmBase, handleError])

  // Refetch balance when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => {
        refetchBalance()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isConfirmed, refetchBalance])

  return {
    // Wallet state
    address,
    isConnected,
    
    // Network state
    isCorrectNetwork,
    chainId,
    
    // Token state
    balance,
    formattedBalance,
    
    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    
    // Error state
    error,
    
    // Actions
    handleMint,
    handleSwitchNetwork,
    refetchBalance,
  }
} 