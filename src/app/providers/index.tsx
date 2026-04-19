import type { ReactNode } from 'react'
import { StoreProvider } from './store'
import { I18nProvider, type Locale } from '@/shared/i18n'

type AppProvidersProps = Readonly<{
  children: ReactNode
  initialLocale: Locale
}>

export function AppProviders({ children, initialLocale }: AppProvidersProps) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <StoreProvider>{children}</StoreProvider>
    </I18nProvider>
  )
}
