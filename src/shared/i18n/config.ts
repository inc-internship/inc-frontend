export const SUPPORTED_LOCALES = ['en', 'ru'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'
// Intentionally shared key name for both storages to keep locale state aligned across refreshes.
export const LOCALE_STORAGE_KEY = 'appLocale'
export const LOCALE_COOKIE_NAME = 'appLocale'
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const isLocale = (value: string | null | undefined): value is Locale =>
  SUPPORTED_LOCALES.includes(value as Locale)

export const resolveLocale = (value: string | null | undefined): Locale => {
  if (isLocale(value)) {
    return value
  }

  return DEFAULT_LOCALE
}
