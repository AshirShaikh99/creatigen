import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    // Optional: Specify directories to ignore
    dirs: [],
  },
};

export default nextConfig;
