import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    config.resolve.fallback = {
      fs: false,
    };
    return config
  }
};

export default nextConfig;
