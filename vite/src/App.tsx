import { SolanaToEvmCard, EvmToSolanaCard } from "./components/send";
import { SolanaOftCard, EvmOftCard } from "./components/oft";
import { SolanaMintCard, EvmMintCard } from "./components/mint";
import { 
  SolanaWalletProvider, 
  SolanaConnect, 
  EthereumConnect, 
  WagmiProviderWrapper 
} from "./components/wallet";
import { getNetworkName } from "./utils/network";
import { useChainId } from "wagmi";

function AppContent() {
  const chainId = useChainId();
  const networkName = getNetworkName(chainId);

  return (
    <div className="min-h-screen bg-layerzero-black lz-grid-bg">
      {/* Header */}
      <header className="border-b border-layerzero-gray-900">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="lz-protocol-text">
              LayerZero Demo Application
            </div>
            <div className="lz-protocol-text">
              /// One OFT. 130+ Blockchains.
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="max-w-4xl">
              <h2 className="text-4xl font-bold text-layerzero-white mb-4 leading-tight">
                Demo:{" "}
                <span className="text-layerzero-purple-500">
                  Omnichain
                </span>
                {" "}Token Transfers using LayerZero
              </h2>
              <p className="text-layerzero-gray-400 text-lg mb-4 max-w-2xl">
                Demo application showcasing seamless token transfers between <span className="font-semi text-layerzero-white">{networkName}</span> and <span className="font-semi text-layerzero-white">Solana</span> using LayerZero's <a href="https://docs.layerzero.network/v2/concepts/glossary#oft-omnichain-fungible-token" target="_blank" rel="noopener noreferrer" className="font-semi text-layerzero-white hover:text-layerzero-purple-400 underline">OFT</a> standard.
              </p>
              <div className="lz-protocol-text">
                /// Demo Only. Not for Production Use.
              </div>
            </div>
          </div>

          {/* Section 01: Token Information */}
          <div className="lz-section">
            <div className="lz-section-title">
              <div className="lz-section-number">01 /</div>
              <h3>Token Information</h3>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="lz-card">
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-layerzero-white mb-2">
                    Solana OFT
                  </h4>
                  <p className="text-layerzero-gray-500 text-sm">
                    View OFT token details on Solana and your balance
                  </p>
                </div>
                <SolanaOftCard />
              </div>
              
              <div className="lz-card">
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-layerzero-white mb-2">
                    {networkName} OFT
                  </h4>
                  <p className="text-layerzero-gray-500 text-sm">
                    View OFT token details on {networkName} and your balance
                  </p>
                </div>
                <EvmOftCard />
              </div>
            </div>
          </div>

          {/* Section 02: Wallet Connections */}
          <div className="lz-section">
            <div className="lz-section-title">
              <div className="lz-section-number">02 /</div>
              <h3>Wallet Connections</h3>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="lz-card">
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-layerzero-white mb-2">
                    Solana Network
                  </h4>
                  <p className="text-layerzero-gray-500 text-sm">
                    Connect your Solana wallet to interact with SPL tokens
                  </p>
                </div>
                <SolanaConnect />
              </div>
              
              <div className="lz-card">
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-layerzero-white mb-2">
                    {networkName} Network
                  </h4>
                  <p className="text-layerzero-gray-500 text-sm">
                    Connect your {networkName} wallet to interact with ERC-20 tokens
                  </p>
                </div>
                <EthereumConnect />
              </div>
            </div>
          </div>

          {/* Section 03: Mint OFT */}
          <div className="lz-section">
            <div className="lz-section-title">
              <div className="lz-section-number">03 /</div>
              <h3>Mint OFT</h3>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="lz-card">
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-layerzero-white mb-2">
                    Solana Mint
                  </h4>
                  <p className="text-layerzero-gray-500 text-sm">
                    View your balance and mint OFT tokens on Solana
                  </p>
                </div>
                <SolanaMintCard />
              </div>
              
              <div className="lz-card">
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-layerzero-white mb-2">
                    {networkName} Mint
                  </h4>
                  <p className="text-layerzero-gray-500 text-sm">
                    View your balance and mint OFT tokens on {networkName}
                  </p>
                </div>
                <EvmMintCard />
              </div>
            </div>
          </div>
          
          {/* Section 04: Cross-Chain Transfer */}
          <div className="lz-section">
            <div className="lz-section-title">
              <div className="lz-section-number">04 /</div>
              <h3>Send OFT Cross-Chain</h3>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="lz-card">
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-layerzero-white mb-2">
                    Solana → {networkName}
                  </h4>
                  <p className="text-layerzero-gray-500 text-sm">
                    Transfer tokens from Solana to {networkName} network
                  </p>
                </div>
                <SolanaToEvmCard />
              </div>
              
              <div className="lz-card">
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-layerzero-white mb-2">
                    {networkName} → Solana
                  </h4>
                  <p className="text-layerzero-gray-500 text-sm">
                    Transfer tokens from {networkName} to Solana network
                  </p>
                </div>
                <EvmToSolanaCard />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-layerzero-gray-900 mt-32">
        <div className="container mx-auto px-8 py-12">
          <div className="flex justify-between items-center">
            <div className="lz-protocol-text">
              Demo Application • LayerZero Protocol
            </div>
            <div className="lz-protocol-text">
              Not for Production Use
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <WagmiProviderWrapper>
      <SolanaWalletProvider>
        <AppContent />
      </SolanaWalletProvider>
    </WagmiProviderWrapper>
  );
}

export default App;
