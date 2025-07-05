import OftQuote from "./components/OftQuote";
import { SolanaWalletProvider } from "./components/SolanaWalletProvider";
import { SolanaConnect } from "./components/SolanaConnect";
import { EthereumConnect } from "./components/EthereumConnect";
import { WagmiProviderWrapper } from "./components/WagmiProvider";

function App() {
  return (
    <WagmiProviderWrapper>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              LayerZero Solana OFT SDK Example
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <SolanaWalletProvider>
                <SolanaConnect />
              </SolanaWalletProvider>
              
              <EthereumConnect />
            </div>
            
            <SolanaWalletProvider>
              <OftQuote />
            </SolanaWalletProvider>
          </div>
        </div>
      </div>
    </WagmiProviderWrapper>
  );
}

export default App;
