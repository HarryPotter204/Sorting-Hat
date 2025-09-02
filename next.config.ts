import { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ビルド中の型エラーを無視
  },
  eslint: {
    ignoreDuringBuilds: true, // ビルド中の ESLint エラーを無視
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
