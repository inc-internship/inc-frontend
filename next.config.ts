import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [new URL('https://minglo-media-bucket.storage.yandexcloud.net/**')],
  },
}

export default nextConfig
