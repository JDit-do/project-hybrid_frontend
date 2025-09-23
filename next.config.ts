import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { 
    ignoreDuringBuilds: false,
    dirs: ['src']
  },
  // typescript: { ignoreBuildErrors: true },
  images: {
    domains: [
      "memory-images-originals-dev.s3.amazonaws.com",
      "memory-images-orginals-dev.s3.amazonaws.com",
    ],
  },
};

export default nextConfig;
