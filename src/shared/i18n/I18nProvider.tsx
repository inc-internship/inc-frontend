'use client'

import { ReactNode, createContext, useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { resolveLocale, type Locale } from './config'
import { getLocalizedPath } from './routing'
import { translate } from './translate'
import type { TranslationParams } from './types'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: TranslationParams) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)

type I18nProviderProps = {
  children: ReactNode
  initialLocale?: Locale
}

export const I18nProvider = ({ children, initialLocale }: I18nProviderProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = resolveLocale(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) {
        return
      }

      document.documentElement.lang = nextLocale

      const localizedPathname = getLocalizedPath(nextLocale, pathname ?? '/')
      const targetPath = `${localizedPathname}${window.location.search}${window.location.hash}`

      router.replace(targetPath)
    },
    [locale, pathname, router],
  )

  const t = useCallback(
    (key: string, params?: TranslationParams) => {
      return translate(locale, key, params)
    },
    [locale],
  )

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
