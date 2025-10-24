/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Enable static export for easy deployment
  distDir: 'out',
  // Explicitly set the root directory to fix deployment issues
  experimental: {
    turbo: {
      root: process.cwd()
    }
  }
}

module.exports = nextConfig
