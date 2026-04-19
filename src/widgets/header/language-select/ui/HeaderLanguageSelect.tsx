'use client'

import { useMemo } from 'react'
import { Select, type SelectOption } from '@/shared/ui/Select'
import { isLocale, useI18n } from '@/shared/i18n'

const languageOptions: Record<'en' | 'ru', Omit<SelectOption, 'label'>> = {
  en: { value: 'en', iconSrc: '/icons/flags/flag-united-kingdom.svg' },
  ru: { value: 'ru', iconSrc: '/icons/flags/flag-russia.svg' },
}

export const HeaderLanguageSelect = () => {
  const { locale, setLocale, t } = useI18n()
  const options = useMemo<SelectOption[]>(
    () => [
      { ...languageOptions.en, label: t('language.english') },
      { ...languageOptions.ru, label: t('language.russian') },
    ],
    [t],
  )

  return (
    <Select
      options={options}
      value={locale}
      onChange={value => {
        if (isLocale(value)) {
          setLocale(value)
        }
      }}
    />
  )
}
