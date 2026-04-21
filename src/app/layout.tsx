import type { Metadata } from 'next'
import { AppProviders } from './providers'
import './styles/index.scss'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import { AuthGate, AuthInitializer } from '@/app/providers/auth'
import { ToastProvider } from '@/app/providers/toast'

export const metadata: Metadata = {
  title: 'Main page',
  description: 'Main page',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AuthInitializer />
          <AuthGate>{children}</AuthGate>
          <ToastProvider />
        </AppProviders>
      </body>
    </html>
  )
}
