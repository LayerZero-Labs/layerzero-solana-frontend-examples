// Demo/Test utility for LayerZero Scan API retry logic
import { fetchMessageStatus } from './layerzero-scan';

/**
 * Demo function to test the retry logic
 * This simulates the flow of checking message status for a new transaction
 */
export async function demoRetryLogic() {
  console.log('🔄 Testing LayerZero Scan API retry logic...');
  
  // Example transaction hash from the user's original request
  const testTxHash = '0x50b9b879f9c9b64f3fa22cc1a85a1b236281a59dca814b3cf4bf741d52061cf0';
  
  console.log(`📋 Testing with tx hash: ${testTxHash}`);
  
  try {
    // First attempt - likely returns 404 if too soon
    console.log('🎯 First attempt...');
    const result1 = await fetchMessageStatus(testTxHash, 'TESTNET');
    
    if (result1) {
      console.log('✅ Message found on first attempt:', result1.status.name);
      return result1;
    } else {
      console.log('❌ Message not found (404) - this is normal for new transactions');
    }
    
    // Simulate retry logic (normally handled by the hook)
    console.log('⏳ Simulating retry in 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🎯 Second attempt...');
    const result2 = await fetchMessageStatus(testTxHash, 'TESTNET');
    
    if (result2) {
      console.log('✅ Message found on retry:', result2.status.name);
      return result2;
    } else {
      console.log('❌ Message still not found - would continue polling...');
    }
    
  } catch (error) {
    console.error('❌ Error during demo:', error);
  }
  
  console.log('💡 In real usage, the React hook will handle this automatically!');
}

/**
 * Simple test to verify API connectivity
 */
export async function testApiConnectivity() {
  console.log('🔗 Testing API connectivity...');
  
  try {
    // Test with a known transaction hash that should exist
    const result = await fetchMessageStatus('0x50b9b879f9c9b64f3fa22cc1a85a1b236281a59dca814b3cf4bf741d52061cf0', 'TESTNET');
    
    if (result) {
      console.log('✅ API is working! Message status:', result.status.name);
      console.log('📊 Message details:', {
        id: result.pathway.id,
        srcChain: result.pathway.srcEid,
        dstChain: result.pathway.dstEid,
        status: result.status.name
      });
    } else {
      console.log('ℹ️ API is working but message not found (404)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ API connectivity test failed:', error);
    return false;
  }
}

// For browser console testing
if (typeof window !== 'undefined') {
  interface WindowWithTest extends Window {
    testLayerZeroScan?: {
      demoRetryLogic: () => Promise<import('./layerzero-scan').LayerZeroMessage | undefined>;
      testApiConnectivity: () => Promise<boolean>;
    };
  }
  
  (window as WindowWithTest).testLayerZeroScan = {
    demoRetryLogic,
    testApiConnectivity
  };
  
  console.log('💡 LayerZero Scan API demo available! Try:');
  console.log('  - testLayerZeroScan.testApiConnectivity()');
  console.log('  - testLayerZeroScan.demoRetryLogic()');
} 