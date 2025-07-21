import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false,
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
