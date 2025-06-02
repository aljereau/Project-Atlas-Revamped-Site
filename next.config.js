/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is deprecated in Next.js 14, removing it
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [],
  },
  // Performance optimizations for smooth animations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable static optimization where possible
  output: 'standalone',
  poweredByHeader: false,
}

module.exports = nextConfig 