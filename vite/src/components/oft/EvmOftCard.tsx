import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { optimismSepolia } from 'wagmi/chains'
import { CONTRACTS } from '../../config/contracts'
import { myOftMockAbi } from '../../evm/MyOFTMock'

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

  return (
    <div className="bg-layerzero-gray-900 border border-layerzero-gray-800 rounded-none p-6">
      <h3 className="text-lg font-medium text-layerzero-white mb-4">
        EVM OFT
      </h3>
      
      <div className="space-y-4">
        {/* Token Information - Always visible */}
        <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
          <h4 className="font-medium text-layerzero-white mb-3">
            Token Information
          </h4>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-layerzero-gray-400">
                <span className="font-medium">Contract Address:</span>
              </p>
              <p className="font-mono text-xs text-layerzero-white break-all">
                {SEPOLIA_OFT_ADDRESS}
              </p>
            </div>
            <div>
              <p className="text-sm text-layerzero-gray-400">
                <span className="font-medium">Network:</span>
              </p>
              <p className="text-xs text-layerzero-white">
                OP Sepolia Testnet (Chain ID: {optimismSepolia.id})
              </p>
            </div>
            <div>
              <p className="text-sm text-layerzero-gray-400">
                <span className="font-medium">Token Standard:</span>
              </p>
              <p className="text-xs text-layerzero-white">
                ERC-20 OFT (Omnichain Fungible Token)
              </p>
            </div>
          </div>
        </div>

        {/* Wallet-specific functionality */}
        {!isConnected ? (
          <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
            <p className="text-sm text-layerzero-gray-400 text-center">
              Connect your Ethereum wallet to view balance and mint tokens
            </p>
          </div>
        ) : (
          <>
            {/* Network check - Only when wallet connected */}
            {!isCorrectNetwork && (
              <div className="p-4 bg-layerzero-gray-800 border border-yellow-400 rounded-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-400">
                      Wrong Network
                    </p>
                    <p className="text-xs text-layerzero-gray-400 mt-1">
                      Please switch to OP Sepolia to use OFT features
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

            {/* Balance section - Only when wallet connected */}
            <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
              <h4 className="font-medium text-layerzero-white mb-2">Your Balance</h4>
              <p className="text-2xl font-bold text-layerzero-white">
                {isCorrectNetwork && balance ? formatEther(balance) : '0'} OFT
              </p>
            </div>

            {/* Mint functionality - Only when wallet connected */}
            <button
              onClick={handleMint}
              disabled={!isCorrectNetwork || isPending || isConfirming}
              className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isCorrectNetwork ? 'Switch to OP Sepolia' : 
               isPending ? 'Confirming...' : 
               isConfirming ? 'Minting...' : 
               'Mint OFT Tokens'}
            </button>

            {isConfirmed && isCorrectNetwork && (
              <div className="p-3 bg-layerzero-gray-800 border border-green-400 rounded-none">
                <p className="text-sm text-green-400">
                  ✅ Successfully minted 100 OFT tokens!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 