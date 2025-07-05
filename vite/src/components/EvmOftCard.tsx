import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { CONTRACTS } from '../config/contracts'
import { myOftMockAbi } from '../evm/MyOFTMock'

export default function EvmOftCard() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const SEPOLIA_OFT_ADDRESS = CONTRACTS.SEPOLIA_OFT_ADDRESS as `0x${string}`

  // Read user's token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: SEPOLIA_OFT_ADDRESS,
    abi: myOftMockAbi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: { enabled: !!address }
  })

  const handleMint = async () => {
    if (!address) return

    try {
      writeContract({
        address: SEPOLIA_OFT_ADDRESS,
        abi: myOftMockAbi,
        functionName: 'mint',
        args: [address, parseEther('100')], // Mint 100 OFT tokens
      })
    } catch (error) {
      console.error('Error minting:', error)
    }
  }

  // Refetch balance when transaction is confirmed
  if (isConfirmed) {
    setTimeout(() => {
      refetchBalance()
    }, 1000)
  }

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          EVM OFT
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Connect your Ethereum wallet to view OFT balance and mint tokens.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        EVM OFT
      </h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Balance</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {balance ? formatEther(balance) : '0'} OFT
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            <span className="font-medium">Contract:</span> <span className="font-mono text-xs">{SEPOLIA_OFT_ADDRESS}</span>
          </p>
        </div>

        <button
          onClick={handleMint}
          disabled={isPending || isConfirming}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Mint OFT Tokens'}
        </button>

        {isConfirmed && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ Successfully minted 100 OFT tokens!
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 