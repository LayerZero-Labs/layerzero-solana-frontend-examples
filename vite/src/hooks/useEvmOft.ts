import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'
import { myOftMockAbi } from '../vm-artifacts/evm/MyOFTMock'
import { 
  formatTokenBalance, 
  isSupportedEvmChain, 
  getTargetEvmChain, 
  getEvmOftContracts, 
  processEvmError, 
  getMintParameters 
} from '../utils/oft'

export function useEvmOft() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const [error, setError] = useState<string | null>(null)

  // Network check
  const isCorrectNetwork = isSupportedEvmChain(chainId)
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

    setError(null)
    try {
      const mintParams = getMintParameters(address, '1')
      writeContract({
        address: mintParams.address,
        abi: myOftMockAbi,
        functionName: mintParams.functionName,
        args: mintParams.args,
      })
    } catch (error) {
      console.error('Error minting:', error)
      setError(processEvmError(error))
    }
  }, [address, isCorrectNetwork, writeContract])

  // Handle network switching
  const handleSwitchNetwork = useCallback(() => {
    const targetChain = getTargetEvmChain()
    switchChain({ chainId: targetChain.id })
  }, [switchChain])

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