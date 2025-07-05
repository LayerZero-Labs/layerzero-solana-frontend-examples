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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              LayerZero Omnichain Token Transfer
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Transfer tokens between Ethereum and Solana using LayerZero
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-6">
                <SolanaWalletProvider>
                  <SolanaConnect />
                </SolanaWalletProvider>
                <SolanaWalletProvider>
                  <SolanaOftCard />
                </SolanaWalletProvider>
              </div>
              
              <div className="space-y-6">
                <EthereumConnect />
                <EvmOftCard />
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <SolanaWalletProvider>
                <OftQuote />
              </SolanaWalletProvider>
              
              <EvmOftSend />
            </div>
          </div>
        </div>
      </div>
    </WagmiProviderWrapper>
  );
}

export default App;
