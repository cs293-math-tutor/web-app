import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      sharp$: { browser: "" },
      "onnxruntime-node$": { browser: "" },
    },
  },
};

export default nextConfig;
