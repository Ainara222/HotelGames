import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/HotelGames" : "",
  images: {
    unoptimized: true,
  },
  experimental: {
    agentFeedback: true,
  },
};

export default nextConfig;
