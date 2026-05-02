export const SUPPORTED_LOCALES = ['en', 'ru'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_STORAGE_KEY = 'appLocale'

export const isLocale = (value: string | null | undefined): value is Locale =>
  SUPPORTED_LOCALES.includes(value as Locale)

export const resolveLocale = (value: string | null | undefined): Locale => {
  if (isLocale(value)) {
    return value
  }

  return DEFAULT_LOCALE
}
