import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // Build paytida TypeScript xatolarini cheklab o‘tish
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
