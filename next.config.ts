import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dynamic-raccoon-209.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
