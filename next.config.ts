import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://minglo-media-bucket.storage.yandexcloud.net/**')],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://minglo.blog/api/:path*',
      },
    ]
  },
}

export default nextConfig
