import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { optimismSepolia } from 'wagmi/chains'
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { addressToBytes32 } from '@layerzerolabs/lz-v2-utilities'
import { myOftMockAbi } from '../../evm/MyOFTMock'
import { CONTRACTS } from '../../config/contracts'

const SEPOLIA_OFT_ADDRESS = CONTRACTS.SEPOLIA_OFT_ADDRESS as `0x${string}`

export default function EvmToSolanaCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const isCorrectNetwork = chainId === optimismSepolia.id

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

  const handleSwitchNetwork = () => {
    switchChain({ chainId: optimismSepolia.id })
  }

  const sendTokens = async () => {
    if (!amount || !recipientAddress || !quoteFee || !isCorrectNetwork) return

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
      <p className="text-layerzero-gray-400">
        Please connect your Ethereum wallet to use this feature.
      </p>
    )
  }

  return (
    <div className="space-y-4 mb-6">
        {!isCorrectNetwork && (
          <div className="p-4 bg-layerzero-gray-800 border border-yellow-400 rounded-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-400">
                  Wrong Network
                </p>
                <p className="text-xs text-layerzero-gray-400 mt-1">
                  Please switch to OP Sepolia to send tokens
                </p>
              </div>
              <button
                onClick={handleSwitchNetwork}
                className="lz-button text-xs py-2 px-3"
              >
                Switch Network
              </button>
            </div>
          </div>
        )}

        <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
          <h3 className="font-medium text-layerzero-white mb-2">Your Balance</h3>
          <p className="text-sm text-layerzero-gray-400">
            {isCorrectNetwork && balance ? formatEther(balance) : '0'} OFT
          </p>
        </div>

        <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
          <h3 className="font-medium text-layerzero-white mb-2">Contract Info</h3>
          <p className="text-sm text-layerzero-gray-400">
            <span className="font-medium">OP Sepolia OFT:</span> <span className="font-mono text-xs">{SEPOLIA_OFT_ADDRESS}</span>
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-layerzero-white mb-2">
              Amount to Send
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              className="lz-input w-full"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-layerzero-white mb-2">
              Recipient Address (Solana)
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="lz-input w-full"
              placeholder="Enter Solana address"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={getQuote}
            disabled={!isCorrectNetwork || isQuoting || !amount || !recipientAddress}
            className="flex-1 lz-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isCorrectNetwork ? 'Wrong Network' : isQuoting ? 'Getting Quote...' : 'Get Quote'}
          </button>

          <button
            onClick={sendTokens}
            disabled={!isCorrectNetwork || !quoteFee || isPending || isConfirming}
            className="flex-1 lz-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isCorrectNetwork ? 'Switch to OP Sepolia' : 
             isPending ? 'Confirming...' : 
             isConfirming ? 'Sending...' : 
             'Send Tokens'}
          </button>
        </div>

        {quoteFee !== null && (
          <div className="p-4 bg-layerzero-gray-800 border border-blue-400 rounded-none">
            <p className="text-sm text-blue-400">
              <span className="font-medium">Estimated Fee:</span> {formatEther(quoteFee)} ETH
            </p>
          </div>
        )}

        {isConfirmed && (
          <div className="p-4 bg-layerzero-gray-800 border border-green-400 rounded-none">
            <p className="text-sm text-green-400">
              <span className="font-medium">Transaction Hash:</span>
              {hash && (
                <span className="font-mono text-xs ml-2">{hash}</span>
              )}
            </p>
            {hash && (
              <div className="flex gap-4 mt-2">
                <a 
                  href={`https://optimism-sepolia.blockscout.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-400 underline hover:no-underline"
                >
                  View on OP Sepolia Explorer
                </a>
                <a 
                  href={`https://testnet.layerzeroscan.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-400 underline hover:no-underline"
                >
                  View on LayerZero Scan
                </a>
              </div>
            )}
          </div>
        )}
      </div>
  )
} 