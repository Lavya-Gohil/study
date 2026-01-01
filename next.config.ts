import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/APP',
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'recharts'],
  },
};

export default nextConfig;
