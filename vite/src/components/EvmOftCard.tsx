import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { optimismSepolia } from 'wagmi/chains'
import { CONTRACTS } from '../config/contracts'
import { myOftMockAbi } from '../evm/MyOFTMock'

export default function EvmOftCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

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

  const handleMint = async () => {
    if (!address || !isCorrectNetwork) return

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

  const handleSwitchNetwork = () => {
    switchChain({ chainId: optimismSepolia.id })
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
        {!isCorrectNetwork && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Wrong Network
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                  Please switch to OP Sepolia to use OFT features
                </p>
              </div>
              <button
                onClick={handleSwitchNetwork}
                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded transition-colors"
              >
                Switch Network
              </button>
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Balance</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isCorrectNetwork && balance ? formatEther(balance) : '0'} OFT
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            <span className="font-medium">Network:</span> <span className="font-medium text-blue-600 dark:text-blue-400">OP Sepolia</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Contract:</span> <span className="font-mono text-xs">{SEPOLIA_OFT_ADDRESS}</span>
          </p>
        </div>

        <button
          onClick={handleMint}
          disabled={!isCorrectNetwork || isPending || isConfirming}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {!isCorrectNetwork ? 'Switch to OP Sepolia' : 
           isPending ? 'Confirming...' : 
           isConfirming ? 'Minting...' : 
           'Mint OFT Tokens'}
        </button>

        {isConfirmed && isCorrectNetwork && (
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