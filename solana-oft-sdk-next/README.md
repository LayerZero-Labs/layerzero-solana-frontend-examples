This repo provides a minimal example for using `@layerzerolabs/oft-v2-solana-sdk` in a NextJs app, alongside `@solana/wallet-adapter-react`.

## Getting Started

`npm run dev`

## Solana OFT SDK


Requirements
- `@layerzerolabs/oft-v2-solana-sdk@^3.0.60`
- `@metaplex-foundation/umi@^0.9.2`
- `@solana/web3.js@^1`

Notes on dependencies:

- Using `@metaplex-foundation/umi` versions `1.0.0` or higher will not work will cause type errors.
- Using `@solana/web3.js@2.0.0` or higher will result in an error due to the difference in the connection type between v1 and v2. 
- However, through `@solana/wallet-adapter-react` there can be an import of `@solana/web3.js@^2.0.0`
- To address this, we must override the package version in `package.json`

  ```
  "overrides": {
    "@solana/web3.js": "^1.98.0"
  },
  ```

  Run `npm i` after the above change.
  Then, IMPORTANTLY: delete the `.next` folder to clear the cache. Without doing this, NextJs would still use `@solana/web3.js@^2.0.0` from the cache
  Finally, start back the dev server: `npm run dev`

# Troubleshooting
## Module not found: Can't resolve <dynamic>
When executing `next dev --turbopack`, it reports error:

```bash
./node_modules/@layerzerolabs/lz-utilities/dist/index.mjs:561:12
Module not found: Can't resolve <dynamic>
  559 |   if (fileName.endsWith(".ts")) {
  560 |     enableTS(relativeToPath);
> 561 |     return import(modulePath);
      |            ^^^^^^^^^^^^^^^^^^
  562 |   } else if (fileName.endsWith(".mjs")) {
  563 |     return import(modulePath);
  564 |   } else if (fileName.endsWith(".cjs")) {
```
https://github.com/vercel/next.js/issues/61180

It is an issue related to turbopack. use `next dev` instead of `next dev --turbopack`.
