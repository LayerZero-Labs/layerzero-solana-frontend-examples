import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { optimismSepolia } from 'wagmi/chains'

export function EthereumConnect() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  const isCorrectNetwork = chainId === optimismSepolia.id
  const networkName = isCorrectNetwork ? 'OP Sepolia' : 'Wrong Network'

  if (isConnected) {
    return (
      <div className="space-y-3">
          <div className="text-sm text-layerzero-gray-400">
            <span className="font-medium">Address:</span> {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          <div className="text-sm">
            <span className="font-medium text-layerzero-gray-400">Network:</span>{' '}
            <span className={`font-medium ${isCorrectNetwork ? 'text-green-400' : 'text-red-400'}`}>
              {networkName}
            </span>
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