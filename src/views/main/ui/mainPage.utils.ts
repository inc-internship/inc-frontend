import type { TranslationParams } from '@/shared/i18n'

const DESCRIPTION_PREVIEW_LENGTH = 72
const MIN_COUNTER_DIGITS = 6
const COUNTER_DIGIT_WIDTH = 29
const COUNTER_SIDE_PADDING = 24
const COUNTER_SEPARATOR_WIDTH = 1

type DescriptionPreview = {
  text: string
  isTruncated: boolean
}

export type TranslateFn = (key: string, params?: TranslationParams) => string

export const getDescriptionPreview = (
  description: string,
  fallback: string,
): DescriptionPreview => {
  const normalized = description.trim()

  if (!normalized) {
    return { text: fallback, isTruncated: false }
  }

  if (normalized.length <= DESCRIPTION_PREVIEW_LENGTH) {
    return { text: normalized, isTruncated: false }
  }

  return {
    text: `${normalized.slice(0, DESCRIPTION_PREVIEW_LENGTH - 3)}...`,
    isTruncated: true,
  }
}

export const getRelativeTimeLabel = (isoDate: string, localeCode: string, fallback: string) => {
  const timestamp = Date.parse(isoDate)

  if (Number.isNaN(timestamp)) {
    return fallback
  }

  const deltaMs = timestamp - Date.now()
  const absDeltaMs = Math.abs(deltaMs)
  const formatter = new Intl.RelativeTimeFormat(localeCode, { numeric: 'always' })

  if (absDeltaMs < 60_000) {
    return fallback
  }

  if (absDeltaMs < 3_600_000) {
    return formatter.format(Math.round(deltaMs / 60_000), 'minute')
  }

  if (absDeltaMs < 86_400_000) {
    return formatter.format(Math.round(deltaMs / 3_600_000), 'hour')
  }

  return formatter.format(Math.round(deltaMs / 86_400_000), 'day')
}

export const getCounterDigits = (value: number) => {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0
  const formatted = String(safeValue)

  return formatted.padStart(MIN_COUNTER_DIGITS, '0').split('')
}

export const getCounterWidth = (digitsCount: number) => {
  const safeCount = Math.max(MIN_COUNTER_DIGITS, digitsCount)

  return (
    COUNTER_SIDE_PADDING +
    safeCount * COUNTER_DIGIT_WIDTH +
    (safeCount - 1) * COUNTER_SEPARATOR_WIDTH
  )
}
