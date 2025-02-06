# LayerZero Solana OFT SDK Example

## Quickstart

Also refer to https://docs.layerzero.network/v2/developers/solana/oft/sdk

Requirements:

- `@layerzerolabs/oft-v2-solana-sdk` version `3.0.57` or later
- `vite.config.ts` has the standard `nodePolyfills`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({  
  plugins: [react(), nodePolyfills()],
})
```

## Background

Prior to `@layerzerolabs/oft-v2-solana-sdk@3.0.57`, importing `@layerzerolabs/oft-v2-solana-sdk` in a frontend project using either Next.js or Vite would cause errors relating to server-side imports. It would require tweaking `next.config.ts` or `vite.config.ts`. We have updated the package in `3.0.57` and its peer dependencies to make it work more seamlessly in frontend projects.