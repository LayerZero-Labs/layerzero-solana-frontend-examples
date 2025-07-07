import { useState, useEffect, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { useWallet } from '@solana/wallet-adapter-react'
import { parseEther, formatEther } from 'viem'
import { optimismSepolia } from 'wagmi/chains'
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { addressToBytes32 } from '@layerzerolabs/lz-v2-utilities'
import { myOftMockAbi } from '../evm/MyOFTMock'
import { CONTRACTS } from '../config/contracts'

const SEPOLIA_OFT_ADDRESS = CONTRACTS.SEPOLIA_OFT_ADDRESS as `0x${string}`

export function useEvmToSolana() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })
  const wallet = useWallet()

  // State management
  const [amount, setAmount] = useState('0.1')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [quoteFee, setQuoteFee] = useState<bigint | null>(null)
  const [isQuoting, setIsQuoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Network check
  const isCorrectNetwork = chainId === optimismSepolia.id

  // Auto-populate recipient address when Solana wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setRecipientAddress(wallet.publicKey.toString())
    }
  }, [wallet.connected, wallet.publicKey])

  // Get quote for sending
  const getQuote = useCallback(async () => {
    if (!amount || !recipientAddress) return

    setIsQuoting(true)
    setError(null)
    try {
      // Use a mock fee for now - actual implementation would call quoteSend
      const mockFee = parseEther((parseFloat(amount) * 0.01).toString())
      setQuoteFee(mockFee)
    } catch (error) {
      console.error('Error getting quote:', error)
      setError('Failed to get quote')
    } finally {
      setIsQuoting(false)
    }
  }, [amount, recipientAddress])

  // Handle network switching
  const handleSwitchNetwork = useCallback(() => {
    switchChain({ chainId: optimismSepolia.id })
  }, [switchChain])

  // Send tokens cross-chain
  const sendTokens = useCallback(async () => {
    if (!amount || !recipientAddress || !quoteFee || !isCorrectNetwork) return

    setError(null)
    try {
      const recipientBytes32 = addressToBytes32(recipientAddress)
      const amountLD = parseEther(amount)
      
      const sendParam = {
        dstEid: EndpointId.SOLANA_V2_TESTNET,
        to: `0x${Buffer.from(recipientBytes32).toString('hex')}` as `0x${string}`,
        amountLD,
        minAmountLD: amountLD,
        extraOptions: '0x' as `0x${string}`,
        composeMsg: '0x' as `0x${string}`,
        oftCmd: '0x' as `0x${string}`,
      }

      const messagingFee = {
        nativeFee: quoteFee,
        lzTokenFee: 0n,
      }

      writeContract({
        address: SEPOLIA_OFT_ADDRESS,
        abi: myOftMockAbi,
        functionName: 'send',
        args: [sendParam, messagingFee, address as `0x${string}`],
        value: quoteFee,
      })
    } catch (error) {
      console.error('Error sending tokens:', error)
      setError('Failed to send tokens')
    }
  }, [amount, recipientAddress, quoteFee, isCorrectNetwork, writeContract, address])

  // Format quote fee for display
  const formattedQuoteFee = quoteFee ? formatEther(quoteFee) : null

  return {
    // Wallet state
    address,
    isConnected,
    
    // Network state
    isCorrectNetwork,
    chainId,
    
    // Form state
    amount,
    setAmount,
    recipientAddress,
    setRecipientAddress,
    
    // Quote state
    quoteFee,
    formattedQuoteFee,
    isQuoting,
    
    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    
    // Error state
    error,
    
    // Actions
    getQuote,
    handleSwitchNetwork,
    sendTokens,
  }
} 