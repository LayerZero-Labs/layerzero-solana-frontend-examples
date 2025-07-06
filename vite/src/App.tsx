import OftQuote from "./components/OftQuote";
import EvmOftSend from "./components/EvmOftSend";
import SolanaOftCard from "./components/SolanaOftCard";
import EvmOftCard from "./components/EvmOftCard";
import { SolanaWalletProvider } from "./components/SolanaWalletProvider";
import { SolanaConnect } from "./components/SolanaConnect";
import { EthereumConnect } from "./components/EthereumConnect";
import { WagmiProviderWrapper } from "./components/WagmiProvider";

function App() {
  return (
    <WagmiProviderWrapper>
      <div className="min-h-screen bg-layerzero-black lz-grid-bg">
        {/* Header */}
        <header className="border-b border-layerzero-gray-900">
          <div className="container mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="lz-protocol-text">
                LayerZero Demo Application
              </div>
              <div className="lz-protocol-text">
                /// One Protocol. Any Blockchain.
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
                  Build{" "}
                  <span className="text-layerzero-purple-500">
                    Omnichain
                  </span>
                  {" "}Token Transfers
                </h2>
                <p className="text-layerzero-gray-400 text-lg mb-4 max-w-2xl">
                  Demo application showcasing seamless token transfers between Ethereum and Solana networks using LayerZero's omnichain infrastructure.
                </p>
                <div className="lz-protocol-text">
                  /// Demo Only. Not for Production Use.
                </div>
              </div>
            </div>

            {/* Section 01: Wallet Connections */}
            <div className="lz-section">
              <div className="lz-section-title">
                <div className="lz-section-number">01 /</div>
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
                  <SolanaWalletProvider>
                    <SolanaConnect />
                  </SolanaWalletProvider>
                </div>
                
                <div className="lz-card">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-layerzero-white mb-2">
                      Ethereum Network
                    </h4>
                    <p className="text-layerzero-gray-500 text-sm">
                      Connect your Ethereum wallet to interact with ERC-20 tokens
                    </p>
                  </div>
                  <EthereumConnect />
                </div>
              </div>
            </div>

            {/* Section 02: Token Information */}
            <div className="lz-section">
              <div className="lz-section-title">
                <div className="lz-section-number">02 /</div>
                <h3>Token Information</h3>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="lz-card">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-layerzero-white mb-2">
                      Solana OFT
                    </h4>
                    <p className="text-layerzero-gray-500 text-sm">
                      View your OFT balance and token details on Solana
                    </p>
                  </div>
                  <SolanaWalletProvider>
                    <SolanaOftCard />
                  </SolanaWalletProvider>
                </div>
                
                <div className="lz-card">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-layerzero-white mb-2">
                      Ethereum OFT
                    </h4>
                    <p className="text-layerzero-gray-500 text-sm">
                      View your OFT balance and token details on Ethereum
                    </p>
                  </div>
                  <EvmOftCard />
                </div>
              </div>
            </div>
            
            {/* Section 03: Cross-Chain Transfer */}
            <div className="lz-section">
              <div className="lz-section-title">
                <div className="lz-section-number">03 /</div>
                <h3>Cross-Chain Transfer</h3>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="lz-card">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-layerzero-white mb-2">
                      Solana → Ethereum
                    </h4>
                    <p className="text-layerzero-gray-500 text-sm">
                      Transfer tokens from Solana to Ethereum network
                    </p>
                  </div>
                  <SolanaWalletProvider>
                    <OftQuote />
                  </SolanaWalletProvider>
                </div>
                
                <div className="lz-card">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-layerzero-white mb-2">
                      Ethereum → Solana
                    </h4>
                    <p className="text-layerzero-gray-500 text-sm">
                      Transfer tokens from Ethereum to Solana network
                    </p>
                  </div>
                  <EvmOftSend />
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
    </WagmiProviderWrapper>
  );
}

export default App;
