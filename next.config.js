const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  // Habilita los source maps en producción:
  productionBrowserSourceMaps: true,

  webpack: (config, options) => {
    // Agrega tsconfig-paths-webpack-plugin
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
