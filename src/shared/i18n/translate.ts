import { DEFAULT_LOCALE, type Locale } from './config'
import en from './languages/en.json'
import ru from './languages/ru.json'
import type { TranslationParams } from './types'

const warnedMissingKeys = new Set<string>()
const dictionaries: Record<Locale, Record<string, unknown>> = {
  en,
  ru,
}

const getByPath = (source: Record<string, unknown>, key: string): string | undefined => {
  const value = key.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[segment]
    }

    return undefined
  }, source)

  return typeof value === 'string' ? value : undefined
}

const interpolate = (template: string, params?: TranslationParams) => {
  if (!params) {
    return template
  }

  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key: string) => {
    const value = params[key]

    return value === undefined ? '' : String(value)
  })
}

export const translate = (locale: Locale, key: string, params?: TranslationParams) => {
  const localeTemplate = getByPath(dictionaries[locale], key)
  const defaultTemplate = getByPath(dictionaries[DEFAULT_LOCALE], key)
  const template = localeTemplate ?? defaultTemplate ?? key

  if (!localeTemplate && !defaultTemplate && process.env.NODE_ENV !== 'production') {
    if (!warnedMissingKeys.has(key)) {
      warnedMissingKeys.add(key)
      console.warn(`[i18n] Missing translation key: "${key}" (locale: "${locale}")`)
    }
  }

  return interpolate(template, params)
}
