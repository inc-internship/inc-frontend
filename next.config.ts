import type { NextConfig } from 'next'

const normalizeOrigin = (origin?: string) => origin?.replace(/\/+$/, '')
const apiProxyOrigin = normalizeOrigin(process.env.API_PROXY_ORIGIN)
const appOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_BASE_URL)

if (apiProxyOrigin) {
  const apiProxyUrl = new URL(apiProxyOrigin)

  if (apiProxyUrl.pathname !== '/') {
    throw new Error(
      'API_PROXY_ORIGIN should contain only an origin, for example https://minglo.blog',
    )
  }

  if (process.env.NODE_ENV === 'production' && apiProxyOrigin === appOrigin) {
    throw new Error('API_PROXY_ORIGIN must not match NEXT_PUBLIC_BASE_URL in production')
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minglo-media-bucket.storage.yandexcloud.net',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    if (!apiProxyOrigin) {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyOrigin}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
