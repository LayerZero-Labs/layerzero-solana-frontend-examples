import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { optimismSepolia } from 'wagmi/chains'
import { useState, useEffect, useCallback } from 'react'
import { CONTRACTS } from '../config/contracts'
import { myOftMockAbi } from '../evm/MyOFTMock'

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
  const isCorrectNetwork = chainId === optimismSepolia.id
  const SEPOLIA_OFT_ADDRESS = CONTRACTS.SEPOLIA_OFT_ADDRESS as `0x${string}`

  // Read user's token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: SEPOLIA_OFT_ADDRESS,
    abi: myOftMockAbi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: { enabled: !!address }
  })

  // Format balance for display
  const formattedBalance = balance ? formatEther(balance) : '0'

  // Handle mint operation
  const handleMint = useCallback(async () => {
    if (!address || !isCorrectNetwork) return

    setError(null)
    try {
      writeContract({
        address: SEPOLIA_OFT_ADDRESS,
        abi: myOftMockAbi,
        functionName: 'mint',
        args: [address, parseEther('1')], // Mint 1 OFT tokens
      })
    } catch (error) {
      console.error('Error minting:', error)
      setError('Failed to mint tokens')
    }
  }, [address, isCorrectNetwork, writeContract, SEPOLIA_OFT_ADDRESS])

  // Handle network switching
  const handleSwitchNetwork = useCallback(() => {
    switchChain({ chainId: optimismSepolia.id })
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