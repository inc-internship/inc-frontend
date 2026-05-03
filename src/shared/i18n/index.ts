export { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale, resolveLocale, type Locale } from './config'
export {
  getLocaleFromPathname,
  getLocalizedPath,
  replaceLocaleInPathname,
  stripLocaleFromPathname,
} from './routing'
export { I18nProvider } from './I18nProvider'
export { translate } from './translate'
export type { TranslationParams } from './types'
export { useI18n } from './useI18n'
