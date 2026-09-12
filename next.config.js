/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Force all pages to be dynamic
  staticPageGenerationTimeout: 0,
}

module.exports = nextConfig
