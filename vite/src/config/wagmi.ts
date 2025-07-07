import { createConfig, http } from 'wagmi'
import { optimismSepolia, arbitrum, base, optimism, polygon } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Get your project ID from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

export const wagmiConfig = createConfig({
  chains: [optimismSepolia, arbitrum, base, optimism, polygon],
  connectors: [
    injected(),
    metaMask(),
    // walletConnect({ projectId }),
  ],
  transports: {
    [optimismSepolia.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
  },
}) 