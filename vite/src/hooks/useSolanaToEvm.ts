import { useChainId, useAccount } from "wagmi";
import { useState, useEffect, useCallback } from "react";

// Import utilities
import {
  useUmiWithWallet,
  useEndpointId,
  getNetworkName,
  useMultipleLoadingStates,
  useStableSolanaContracts,
  getOftQuote,
  sendOftTransaction,
  processLayerZeroError,
  useSolanaBase,
} from './utils';

interface SendState {
  isLoading: boolean;
  txHash: string | null;
  error: string | null;
}

export function useSolanaToEvm() {
  const solanaBase = useSolanaBase();
  const { wallet, walletReady } = solanaBase;
  const chainId = useChainId();
  const { address: ethereumAddress, isConnected: isEthereumConnected } = useAccount();

  // Use utility hooks
  const umiWithWallet = useUmiWithWallet();
  const toEid = useEndpointId(chainId);
  const contractValues = useStableSolanaContracts();
  const { isLoading: isQuoting, withLoading } = useMultipleLoadingStates();

  const [isClient, setIsClient] = useState(false);
  const [amount, setAmount] = useState('0.1');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [nativeFee, setNativeFee] = useState<bigint | null>(null);
  const [sendState, setSendState] = useState<SendState>({
    isLoading: false,
    txHash: null,
    error: null
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-populate recipient address when Ethereum wallet connects
  useEffect(() => {
    if (isEthereumConnected && ethereumAddress && !recipientAddress) {
      setRecipientAddress(ethereumAddress);
    }
  }, [isEthereumConnected, ethereumAddress]);

  const onClickQuote = useCallback(async () => {
    if (!walletReady.isReady || !umiWithWallet) {
      console.error("Solana wallet is not connected or ready.");
      return;
    }

    if (!recipientAddress.trim()) {
      console.error("Recipient address is required.");
      return;
    }

    setSendState(prev => ({ ...prev, error: null }));

    const result = await withLoading('quote', async () => {
      console.log("Using EndpointId:", toEid, "for chainId:", chainId);
      console.log("Destination address:", recipientAddress);

      return await getOftQuote({
        umi: umiWithWallet,
        contractValues,
        walletPublicKey: walletReady.publicKey!,
        recipientAddress,
        amount,
        toEid,
      });
    }, { logName: 'Quote' });

    if (result !== undefined) {
      setNativeFee(result);
    } else {
      setSendState(prev => ({ ...prev, error: "Failed to get quote" }));
    }
  }, [
    walletReady.isReady, 
    walletReady.publicKey,
    umiWithWallet, 
    recipientAddress, 
    amount, 
    toEid, 
    chainId, 
    contractValues,
    withLoading
  ]);

  const onClickSend = useCallback(async () => {
    if (!walletReady.isReady || !umiWithWallet) {
      console.error("Solana wallet is not connected or ready.");
      return;
    }

    if (!recipientAddress.trim()) {
      console.error("Recipient address is required.");
      return;
    }

    setSendState({ isLoading: true, txHash: null, error: null });

    try {
      let currentNativeFee = nativeFee;
      
      // If no quote exists, get one automatically
      if (currentNativeFee === null) {
        console.log("No quote available. Getting quote automatically...");
        
        const result = await withLoading('quote', async () => {
          console.log("Using EndpointId:", toEid, "for chainId:", chainId);
          console.log("Destination address:", recipientAddress);

          return await getOftQuote({
            umi: umiWithWallet,
            contractValues,
            walletPublicKey: walletReady.publicKey!,
            recipientAddress,
            amount,
            toEid,
          });
        }, { logName: 'Quote' });

        if (result !== undefined) {
          setNativeFee(result);
          currentNativeFee = result;
        } else {
          setSendState({ 
            isLoading: false, 
            txHash: null, 
            error: "Failed to get quote automatically"
          });
          return;
        }
      }

      const signature = await sendOftTransaction({
        umi: umiWithWallet,
        contractValues,
        walletPublicKey: walletReady.publicKey!,
        recipientAddress,
        amount,
        toEid,
        nativeFee: currentNativeFee,
      });

      const txHash = signature;
      console.log("Cross-chain OFT transaction sent:", txHash);
      setSendState({ isLoading: false, txHash, error: null });

    } catch (error) {
      console.error("Cross-chain OFT send failed:", error);
      const errorMessage = processLayerZeroError(error);
      setSendState({ 
        isLoading: false, 
        txHash: null, 
        error: errorMessage
      });
    }
  }, [
    walletReady.isReady, 
    walletReady.publicKey,
    umiWithWallet, 
    recipientAddress, 
    nativeFee, 
    amount, 
    toEid, 
    contractValues,
    withLoading,
    chainId
  ]);

  return {
    // Client state
    isClient,
    
    // Wallet state
    wallet,
    ethereumAddress,
    isEthereumConnected,
    
    // Network state
    chainId,
    toEid,
    getNetworkName,
    
    // Form state
    amount,
    setAmount,
    recipientAddress,
    setRecipientAddress,
    
    // Quote state
    nativeFee,
    isQuoting: isQuoting('quote'),
    
    // Send state
    sendState,
    
    // Actions
    onClickQuote,
    onClickSend,
  }
} 