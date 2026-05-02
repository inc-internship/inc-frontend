import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { AppProviders } from './providers'
import './styles/index.scss'
import 'react-loading-skeleton/dist/skeleton.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import { AuthInitializer } from '@/app/providers/auth'
import { LOCALE_COOKIE_NAME, resolveLocale } from '@/shared/i18n/config'
import { ToastProvider } from '@/app/providers/toast'

export const metadata: Metadata = {
  title: 'Main page',
  description: 'Main page',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value)

  return (
    <html lang={locale}>
      <body>
        <AppProviders initialLocale={locale}>
          <AuthInitializer />
          {children}
          <ToastProvider />
        </AppProviders>
      </body>
    </html>
  )
}
