import OftQuote from "./components/OftQuote";
import { SolanaWalletProvider } from "./components/SolanaWalletProvider";
import { SolanaConnect } from "./components/SolanaConnect";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <SolanaWalletProvider>
        <SolanaConnect />
        <OftQuote />
      </SolanaWalletProvider>
    </div>
  );
}

export default App;
