import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      rules: {
        "*.{ts,tsx}": {
          ignore: ["turbopack-tracing"],
        },
      },
    },
  },
};

export default nextConfig;
