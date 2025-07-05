import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { addressToBytes32 } from '@layerzerolabs/lz-v2-utilities'
import { myOftMockAbi } from '../evm/MyOFTMock'
import { CONTRACTS } from '../config/contracts'

const SEPOLIA_OFT_ADDRESS = CONTRACTS.SEPOLIA_OFT_ADDRESS as `0x${string}`

export default function EvmOftSend() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const [amount, setAmount] = useState('0.1')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [quoteFee, setQuoteFee] = useState<bigint | null>(null)
  const [isQuoting, setIsQuoting] = useState(false)

  // Read user's token balance
  const { data: balance } = useReadContract({
    address: SEPOLIA_OFT_ADDRESS,
    abi: myOftMockAbi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: { enabled: !!address }
  })

  // Get quote for sending
  const getQuote = async () => {
    if (!amount || !recipientAddress) return

    setIsQuoting(true)
    try {
      // Use a mock fee for now - actual implementation would call quoteSend
      const mockFee = parseEther((parseFloat(amount) * 0.01).toString())
      setQuoteFee(mockFee)
    } catch (error) {
      console.error('Error getting quote:', error)
    } finally {
      setIsQuoting(false)
    }
  }

  const sendTokens = async () => {
    if (!amount || !recipientAddress || !quoteFee) return

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
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          EVM → Solana Transfer
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your Ethereum wallet to use this feature.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        EVM → Solana Transfer
      </h2>

      <div className="space-y-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Balance</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {balance ? formatEther(balance) : '0'} OFT
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contract Info</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">OP Sepolia OFT:</span> <span className="font-mono text-xs">{SEPOLIA_OFT_ADDRESS}</span>
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount to Send
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipient Address (Solana)
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter Solana address"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={getQuote}
            disabled={isQuoting || !amount || !recipientAddress}
            className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {isQuoting ? 'Getting Quote...' : 'Get Quote'}
          </button>

          <button
            onClick={sendTokens}
            disabled={!quoteFee || isPending || isConfirming}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {isPending ? 'Confirming...' : isConfirming ? 'Sending...' : 'Send Tokens'}
          </button>
        </div>

        {quoteFee !== null && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-medium">Estimated Fee:</span> {formatEther(quoteFee)} ETH
            </p>
          </div>
        )}

        {isConfirmed && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <span className="font-medium">Transaction confirmed!</span>
            </p>
            {hash && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-mono">
                {hash}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 