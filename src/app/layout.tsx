import type { Metadata } from 'next'
import { AppProviders } from './providers'

export const metadata: Metadata = {
  title: 'Main page',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
