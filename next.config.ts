import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [new URL('https://minglo-media-bucket.storage.yandexcloud.net/**')],
  },
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return []
    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) return []
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
