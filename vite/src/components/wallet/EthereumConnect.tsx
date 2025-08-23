import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { FilePathDisplay } from '../FilePathDisplay'

export function EthereumConnect({ networkName, isWrongNetwork }: { networkName: string, isWrongNetwork: boolean }) {
  const { address, isConnected } = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()


  if (isConnected) {
    return (
      <div className="space-y-3">
          <FilePathDisplay text="/vite/src/components/wallet/EthereumConnect.tsx" />
          <div className="text-sm">
            <span className="font-medium text-layerzero-gray-400">Network:</span>{' '}
            <span className={`font-medium ${!isWrongNetwork ? 'text-green-400' : 'text-red-400'}`}>
              {networkName}
            </span>
          </div>
          {isWrongNetwork && (
            <div className="p-4 bg-layerzero-gray-800 border border-yellow-400 rounded-none mt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-400">
                    ⚠️ Wrong Network
                  </p>
                  <p className="text-xs text-layerzero-gray-400 mt-1">
                    Please switch to {networkName} to use EVM features
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (window?.ethereum) {
                      try {
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: '0xaa37dc' }],
                        });
                      } catch (switchError) {
                        if (
                          typeof switchError === 'object' &&
                          switchError !== null &&
                          'code' in switchError &&
                          Number((switchError as Record<string, unknown>).code) === 4902
                        ) {
                          await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                              chainId: '0xaa37dc',
                              chainName: 'OP Sepolia',
                              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                              rpcUrls: ['https://sepolia.optimism.io'],
                              blockExplorerUrls: ['https://optimism-sepolia.blockscout.com/'],
                            }],
                          });
                        }
                      }
                    }
                  }}
                  className="lz-button text-xs py-2 px-3"
                  type="button"
                >
                  Switch Network
                </button>
              </div>
            </div>
          )}
          <div className="text-sm text-white">
            <span className="font-medium text-layerzero-gray-400">Address:</span> {address}
          </div>
          <button
            onClick={() => disconnect()}
            className="w-full lz-button"
          >
            Disconnect
          </button>
        </div>
    )
  }

  return (
    <div className="space-y-3">
      <FilePathDisplay text="/vite/src/components/wallet/EthereumConnect.tsx" />
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          type="button"
          disabled={status === 'pending'}
          className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connector.name}
          {status === 'pending' && ' (connecting...)'}
        </button>
      ))}
      {error && (
        <div className="mt-4 p-3 bg-layerzero-gray-800 border border-red-400 text-red-400 rounded-none">
          {error.message}
        </div>
      )}
    </div>
  )
} 