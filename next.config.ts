import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel handles output */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
};

export default nextConfig;