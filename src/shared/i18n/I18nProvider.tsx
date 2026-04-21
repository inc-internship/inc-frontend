'use client'

import { ReactNode, createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
  resolveLocale,
  type Locale,
} from './config'
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
  const [locale, setLocaleState] = useState<Locale>(resolveLocale(initialLocale))

  const applyLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(prev => (prev === nextLocale ? prev : nextLocale))
  }, [])

  useEffect(() => {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)

    if (!storedLocale) {
      return
    }

    const nextLocale = resolveLocale(storedLocale)
    const timerId = window.setTimeout(() => {
      applyLocale(nextLocale)
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [applyLocale])

  useEffect(() => {
    const secureAttribute = window.location.protocol === 'https:' ? '; secure' : ''

    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax${secureAttribute}`
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    const storageHandler = (event: StorageEvent) => {
      if (event.key !== LOCALE_STORAGE_KEY) return

      const nextLocale = resolveLocale(event.newValue)
      applyLocale(nextLocale)
    }

    window.addEventListener('storage', storageHandler)

    return () => {
      window.removeEventListener('storage', storageHandler)
    }
  }, [applyLocale])

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      applyLocale(nextLocale)
    },
    [applyLocale],
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
