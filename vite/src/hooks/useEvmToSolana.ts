import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { parseEther, formatEther } from 'viem'
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { addressToBytes32 } from '@layerzerolabs/lz-v2-utilities'
import { myOftMockAbi } from '../vm-artifacts/evm/MyOFTMock'
import { CONTRACTS } from '../config/contracts'
import { useEvmBase } from './utils'

const SEPOLIA_OFT_ADDRESS = CONTRACTS.SEPOLIA_OFT_ADDRESS as `0x${string}`

export function useEvmToSolana() {
  const evmBase = useEvmBase({ networkCheck: 'optimism-sepolia' })
  const { address, isConnected, isCorrectNetwork, chainId, hash, isPending, isConfirming, isConfirmed, error, writeContract, handleSwitchNetwork, handleError } = evmBase
  const wallet = useWallet()

  // State management
  const [amount, setAmount] = useState('0.1')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [quoteFee, setQuoteFee] = useState<bigint | null>(null)
  const [isQuoting, setIsQuoting] = useState(false)

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
    evmBase.clearError()
    try {
      // Use a mock fee for now - actual implementation would call quoteSend
      const mockFee = parseEther((parseFloat(amount) * 0.01).toString())
      setQuoteFee(mockFee)
    } catch (error) {
      handleError(error, 'Failed to get quote')
    } finally {
      setIsQuoting(false)
    }
  }, [amount, recipientAddress, evmBase, handleError])



  // Send tokens cross-chain
  const sendTokens = useCallback(async () => {
    if (!amount || !recipientAddress || !isCorrectNetwork) return

    evmBase.clearError()
    try {
      let currentQuoteFee = quoteFee
      
      // If no quote exists, get one automatically
      if (!currentQuoteFee) {
        setIsQuoting(true)
        try {
          // Use a mock fee for now - actual implementation would call quoteSend
          const mockFee = parseEther((parseFloat(amount) * 0.01).toString())
          setQuoteFee(mockFee)
          currentQuoteFee = mockFee
        } catch (quoteError) {
          handleError(quoteError, 'Failed to get quote')
          return
        } finally {
          setIsQuoting(false)
        }
      }

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
        nativeFee: currentQuoteFee,
        lzTokenFee: 0n,
      }

      writeContract({
        address: SEPOLIA_OFT_ADDRESS,
        abi: myOftMockAbi,
        functionName: 'send',
        args: [sendParam, messagingFee, address as `0x${string}`],
        value: currentQuoteFee,
      })
    } catch (error) {
      handleError(error, 'Failed to send tokens')
    }
  }, [amount, recipientAddress, quoteFee, isCorrectNetwork, writeContract, address, evmBase, handleError])

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