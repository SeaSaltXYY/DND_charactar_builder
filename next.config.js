/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3", "pdf-parse"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    // 排除 data 目录，避免文件监听耗尽 fd
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/node_modules/**", "**/data/**", "**/.git/**"],
    };
    return config;
  },
};

module.exports = nextConfig;
