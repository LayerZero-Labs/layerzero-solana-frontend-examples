# LayerZero Scan API Utility

This utility provides functions to fetch and poll LayerZero message status from the LayerZero Scan API.

## Features

- ✅ Fetch message status by transaction hash
- ✅ Poll for message status updates
- ✅ Support for both mainnet and testnet
- ✅ TypeScript support with proper types
- ✅ Error handling and retry logic
- ✅ React hook for easy integration

## Usage

### Basic Usage

```typescript
import { fetchMessageStatus } from '../utils/layerzero-scan';

// Fetch message status
const message = await fetchMessageStatus('0x50b9b879f9c9b64f3fa22cc1a85a1b236281a59dca814b3cf4bf741d52061cf0');

if (message) {
  console.log('Status:', message.status);
  console.log('Source Chain:', message.srcChainId);
  console.log('Destination Chain:', message.dstChainId);
}
```

### Using the React Hook

```typescript
import { useLayerZeroMessageStatus } from '../hooks/useLayerZeroMessageStatus';

function MyComponent({ txHash }: { txHash: string }) {
  const { message, isLoading, error, isFinalized } = useLayerZeroMessageStatus({
    txHash,
    environment: 'TESTNET',
    enablePolling: true,
    pollingInterval: 5000
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!message) return <div>Message not found</div>;

  return (
    <div>
      <p>Status: {message.status}</p>
      <p>Finalized: {isFinalized ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### Using the MessageStatusDisplay Component

```typescript
import { MessageStatusDisplay } from '../components/MessageStatusDisplay';

function MyComponent({ txHash }: { txHash: string }) {
  return (
    <MessageStatusDisplay 
      txHash={txHash}
      environment="TESTNET"
    />
  );
}
```

## API Reference

### `fetchMessageStatus(txHash, environment?)`

Fetches message status for a single transaction hash.

**Parameters:**
- `txHash: string` - The transaction hash to look up
- `environment?: 'MAINNET' | 'TESTNET'` - The LayerZero environment (default: 'TESTNET')

**Returns:** `Promise<LayerZeroMessage | null>`

### `pollMessageStatus(txHash, environment?, maxAttempts?, intervalMs?)`

Polls for message status until it's delivered or failed.

**Parameters:**
- `txHash: string` - The transaction hash to poll
- `environment?: 'MAINNET' | 'TESTNET'` - The LayerZero environment (default: 'TESTNET')
- `maxAttempts?: number` - Maximum number of polling attempts (default: 30)
- `intervalMs?: number` - Polling interval in milliseconds (default: 5000)

**Returns:** `Promise<LayerZeroMessage | null>`

### `useLayerZeroMessageStatus(options)`

React hook for fetching and polling message status.

**Options:**
- `txHash?: string` - The transaction hash to track
- `environment?: 'MAINNET' | 'TESTNET'` - The LayerZero environment
- `enablePolling?: boolean` - Whether to enable automatic polling (default: true)
- `pollingInterval?: number` - Polling interval in milliseconds (default: 5000)

**Returns:**
- `message: LayerZeroMessage | null` - The message data
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message if any
- `refetch: () => Promise<void>` - Function to manually refetch
- `isFinalized: boolean` - Whether the message is in final state

## Message Status Values

- `PENDING` - Message is pending processing
- `INFLIGHT` - Message is being processed
- `DELIVERED` - Message successfully delivered
- `FAILED` - Message delivery failed

## Configuration

The utility uses centralized configuration from `config/contracts.ts`:

```typescript
export const LAYERZERO_SCAN_CONFIG = {
  MAINNET: {
    baseUrl: 'https://scan.layerzero-api.com/v1',
    name: 'mainnet',
    explorerUrl: 'https://layerzeroscan.com'
  },
  TESTNET: {
    baseUrl: 'https://scan-testnet.layerzero-api.com/v1',
    name: 'testnet',
    explorerUrl: 'https://testnet.layerzeroscan.com'
  }
}
```

## Error Handling

The utility includes comprehensive error handling:

- Network errors are caught and re-thrown
- 404 responses return `null` (message not found)
- Other HTTP errors throw with status information
- Polling timeouts throw after max attempts

## Integration with UI

The utility is designed to integrate seamlessly with cross-chain transaction flows:

1. After sending a cross-chain transaction, get the transaction hash
2. Use the `MessageStatusDisplay` component or hook to show status
3. The component will automatically poll for updates until the message is finalized
4. Users can see real-time status updates and click through to explorer links 