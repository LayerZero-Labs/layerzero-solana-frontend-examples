// next.config.ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      module: false,
    };
    return config;
  },
};

export default nextConfig;