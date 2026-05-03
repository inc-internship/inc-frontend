import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AppProviders } from '../providers'
import '../styles/index.scss'
import 'react-loading-skeleton/dist/skeleton.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import { SUPPORTED_LOCALES, isLocale, type Locale } from '@/shared/i18n/config'
import { AuthGate, AuthInitializer } from '@/app/providers/auth'
import { ToastProvider } from '@/app/providers/toast'

export const metadata: Metadata = {
  title: 'Main page',
  description: 'Main page',
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map(lang => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  const locale: Locale = lang

  return (
    <html lang={locale}>
      <body>
        <AppProviders initialLocale={locale}>
          <AuthInitializer />
          <AuthGate>{children}</AuthGate>
          <ToastProvider />
        </AppProviders>
      </body>
    </html>
  )
}
