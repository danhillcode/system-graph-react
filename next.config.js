/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Enable static export for easy deployment
  distDir: 'out',
  // Explicitly set the root directory
  experimental: {
    turbo: {
      root: '/Users/dhill/system-graph-react'
    }
  }
}

module.exports = nextConfig
