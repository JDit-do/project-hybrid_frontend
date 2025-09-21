import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true },
  images: {
    domains: [
      "memory-images-originals-dev.s3.amazonaws.com",
      "memory-images-orginals-dev.s3.amazonaws.com",
    ],
  },
};

export default nextConfig;
