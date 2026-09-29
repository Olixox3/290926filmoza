import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@electric-sql/pglite", "pg", "bcryptjs"],
  images: { unoptimized: true },
  allowedDevOrigins: ["*.grok-sandbox.com", "localhost", "127.0.0.1"],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
