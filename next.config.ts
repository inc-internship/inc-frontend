import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://minglo-media-bucket.storage.yandexcloud.net/**')],
  },
}

export default nextConfig
