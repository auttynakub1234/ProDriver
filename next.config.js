/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  // Force all pages to be dynamic
  staticPageGenerationTimeout: 0,
}

module.exports = nextConfig
