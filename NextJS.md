## Solana OFT SDK

This is a guide for how to use the Solana OFT SDK in a Next.js project.

Requirements
- `@layerzerolabs/oft-v2-solana-sdk@^3.0.60`
- `@layerzerolabs/lz-v2-utilities@^3.0.60`
- `@layerzerolabs/lz-definitions@^3.0.60`
- `@metaplex-foundation/umi@^0.9.2`
- `@metaplex-foundation/umi-bundle-defaults@^0.9.2`
- `@metaplex-foundation/umi-signer-wallet-adapters@^0.9.2`
- `@solana/web3.js@^1`

For your convenience, a single `npm i` (subtitute with your choice of package manager) command:


```
npm i @layerzerolabs/oft-v2-solana-sdk@^3.0.60 @layerzerolabs/lz-v2-utilities@^3.0.60 @layerzerolabs/lz-definitions@^3.0.60 @metaplex-foundation/umi@^0.9.2 @metaplex-foundation/umi-bundle-defaults@^0.9.2 @metaplex-foundation/umi-signer-wallet-adapters@^0.9.2 @solana/web3.js@^1
```

Notes on dependencies:

- Using `@metaplex-foundation/umi` versions `1.0.0` or higher will not work will cause type errors.
- Using `@solana/web3.js@2.0.0` or higher will result in an error due to the difference in the connection type between v1 and v2. 
- However, through `@solana/wallet-adapter-react` there can be an import of `@solana/web3.js@^2.0.0`
- To address this, we must override the package version in `package.json`. The field name varies depending on the package manager you're using:

  npm:

  ```
  "overrides": {
    "@solana/web3.js": "^1.98.0"
  },
  ```

  Run `npm i` after the above change.


  yarn:

    ```
  "resolutions": {
    "@solana/web3.js": "^1.98.0"
  },
  ```

  Run `yarn install` after the above change.


  Then, IMPORTANTLY: delete the `.next` folder to clear the cache. Without doing this, NextJs would still use `@solana/web3.js@^2.0.0` from the cache.

  Update the `next.config.ts` to include the following:

  ``` typescript
  webpack: config => {
    // existing lines
    config.resolve.fallback = {
      fs: false,
    };
    return config
  }
  ```

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