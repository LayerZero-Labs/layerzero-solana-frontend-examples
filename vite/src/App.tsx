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
      <div className="min-h-screen bg-layerzero-black">
        {/* Header */}
        <header className="border-b border-layerzero-gray-800">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-layerzero-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-2xl font-bold text-layerzero-white">
                  LayerZero
                </h1>
              </div>
              <div className="text-layerzero-gray-400 text-sm font-mono">
                Omnichain Protocol
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Introduction */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-layerzero-white mb-4">
                Omnichain Token Transfer
              </h2>
              <p className="text-layerzero-gray-300 text-lg max-w-2xl mx-auto">
                Transfer tokens seamlessly between Ethereum and Solana networks using LayerZero's omnichain infrastructure
              </p>
            </div>

            {/* Section 01: Wallet Connections */}
            <div className="lz-section lz-section-fade-in">
              <div className="lz-section-title">
                <div className="lz-section-number">01</div>
                <h3>Wallet Connections</h3>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="lz-card lz-card-hover">
                  <h4 className="text-xl font-semibold text-layerzero-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                    Solana Wallet
                  </h4>
                  <SolanaWalletProvider>
                    <SolanaConnect />
                  </SolanaWalletProvider>
                </div>
                
                <div className="lz-card lz-card-hover">
                  <h4 className="text-xl font-semibold text-layerzero-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                    Ethereum Wallet
                  </h4>
                  <EthereumConnect />
                </div>
              </div>
            </div>

            {/* Section 02: OFT Tokens */}
            <div className="lz-section lz-section-fade-in">
              <div className="lz-section-title">
                <div className="lz-section-number">02</div>
                <h3>OFT Tokens</h3>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="lz-card lz-card-hover">
                  <h4 className="text-xl font-semibold text-layerzero-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                    Solana OFT
                  </h4>
                  <SolanaWalletProvider>
                    <SolanaOftCard />
                  </SolanaWalletProvider>
                </div>
                
                <div className="lz-card lz-card-hover">
                  <h4 className="text-xl font-semibold text-layerzero-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                    Ethereum OFT
                  </h4>
                  <EvmOftCard />
                </div>
              </div>
            </div>
            
            {/* Section 03: Cross-Chain Transfer */}
            <div className="lz-section lz-section-fade-in">
              <div className="lz-section-title">
                <div className="lz-section-number">03</div>
                <h3>Cross-Chain Transfer</h3>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="lz-card lz-card-hover">
                  <h4 className="text-xl font-semibold text-layerzero-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                    From Solana
                  </h4>
                  <SolanaWalletProvider>
                    <OftQuote />
                  </SolanaWalletProvider>
                </div>
                
                <div className="lz-card lz-card-hover">
                  <h4 className="text-xl font-semibold text-layerzero-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                    From Ethereum
                  </h4>
                  <EvmOftSend />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-layerzero-gray-800 mt-16">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center text-layerzero-gray-400">
              <p className="text-sm">
                Powered by LayerZero • Omnichain Interoperability Protocol
              </p>
            </div>
          </div>
        </footer>
      </div>
    </WagmiProviderWrapper>
  );
}

export default App;
