import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [new URL('https://minglo-media-bucket.storage.yandexcloud.net/**')],
  },
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return []

    const rewrites: { source: string; destination: string }[] = []
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL
    const messengerUrl =
      process.env.NEXT_PUBLIC_MESSENGER_API_URL ?? 'https://messenger.minglo.blog'

    if (backendUrl) {
      rewrites.push({
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      })
    }

    rewrites.push({
      source: '/messenger-api/:path*',
      destination: `${messengerUrl}/:path*`,
    })

    return rewrites
  },
}

export default nextConfig
