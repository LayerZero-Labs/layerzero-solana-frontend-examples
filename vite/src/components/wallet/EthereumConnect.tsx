import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { optimismSepolia } from 'wagmi/chains'

export function EthereumConnect() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  // Use window.ethereum.chainId if available, otherwise fallback to wagmi's useChainId
  let actualChainId: number | null = null;
  if (isConnected && window?.ethereum?.chainId) {
    try {
      actualChainId = parseInt(window.ethereum.chainId, 16);
    } catch {
      actualChainId = null;
    }
  }
  if (!actualChainId) actualChainId = isConnected ? chainId : 11155420; // Default to OP Sepolia if not connected
  const isCorrectNetwork = actualChainId === optimismSepolia.id;
  const networkName = isCorrectNetwork ? 'OP Sepolia' : `Wrong Network (Chain ID: ${actualChainId})`;

  if (isConnected) {
    return (
      <div className="space-y-3">
          <div className="text-sm">
            <span className="font-medium text-layerzero-gray-400">Network:</span>{' '}
            <span className={`font-medium ${isCorrectNetwork ? 'text-green-400' : 'text-red-400'}`}>
              {networkName}
            </span>
          </div>
          {!isCorrectNetwork && (
            <div className="p-4 bg-layerzero-gray-800 border border-yellow-400 rounded-none mt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-400">
                    ⚠️ Wrong Network
                  </p>
                  <p className="text-xs text-layerzero-gray-400 mt-1">
                    Please switch to OP Sepolia to use EVM features
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