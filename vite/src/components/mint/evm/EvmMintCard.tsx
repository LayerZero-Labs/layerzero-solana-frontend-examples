import { useEvmOft } from '../../../hooks/useEvmOft'
import { FilePathDisplay } from '../../FilePathDisplay'

export default function EvmMintCard({ networkName, isWrongNetwork }: { networkName: string, isWrongNetwork: boolean }) {
  const {
    isConnected,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    handleMint,
    handleSwitchNetwork,
    formattedBalance,
  } = useEvmOft()

  return (
    <div className="space-y-4">
      <FilePathDisplay text="/vite/src/components/mint/evm/EvmMintCard.tsx" />
      {error && (
        <div className="mb-4 p-3 bg-layerzero-gray-800 border border-red-400 text-red-400 rounded-none">
          {error}
        </div>
      )}
        {/* Wallet-specific functionality */}
        {!isConnected ? (
          <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
            <p className="text-sm text-layerzero-gray-400 text-center">
              Connect your {networkName} wallet to view balance and mint tokens
            </p>
          </div>
        ) : (
          <>
            {/* Network check - Only when wallet connected */}
            {isWrongNetwork && (
              <div className="p-4 bg-layerzero-gray-800 border border-yellow-400 rounded-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-400">
                      Wrong Network
                    </p>
                    <p className="text-xs text-layerzero-gray-400 mt-1">
                      Please switch to {networkName} to use OFT features
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
                {!isWrongNetwork ? formattedBalance : '0'} OFT
              </p>
            </div>

            {/* Mint functionality - Only when wallet connected */}
            <button
              onClick={handleMint}
              disabled={isWrongNetwork || isPending || isConfirming}
              className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWrongNetwork ? `Switch to ${networkName}` : 
               isPending ? 'Confirming...' : 
               isConfirming ? 'Minting...' : 
               'Mint 1 OFT token'}
            </button>

            {isConfirmed && !isWrongNetwork && (
              <div className="p-3 bg-layerzero-gray-800 border border-green-400 rounded-none">
                <p className="text-sm text-green-400">
                  ✅ Successfully minted 1 OFT token!
                </p>
              </div>
            )}
          </>
        )}
      </div>
  )
} 