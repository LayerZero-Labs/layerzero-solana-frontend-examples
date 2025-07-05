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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Ethereum Wallet Connected
        </h2>
        <div className="space-y-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Address:</span> {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-400">Network:</span>{' '}
            <span className={`font-medium ${isCorrectNetwork ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {networkName}
            </span>
          </div>
          <button
            onClick={() => disconnect()}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Connect Ethereum Wallet
      </h2>
      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
            disabled={status === 'pending'}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {connector.name}
            {status === 'pending' && ' (connecting...)'}
          </button>
        ))}
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error.message}
        </div>
      )}
    </div>
  )
} 