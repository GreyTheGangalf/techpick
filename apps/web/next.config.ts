import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@techpick/engine", "@techpick/db"],
};

export default nextConfig;
