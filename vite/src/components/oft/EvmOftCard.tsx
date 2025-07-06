import { optimismSepolia } from 'wagmi/chains'
import { CONTRACTS } from '../../config/contracts'

export default function EvmOftCard() {
  const SEPOLIA_OFT_ADDRESS = CONTRACTS.SEPOLIA_OFT_ADDRESS as `0x${string}`

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
      </div>
    </div>
  )
} 