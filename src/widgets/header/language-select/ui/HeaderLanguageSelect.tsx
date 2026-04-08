'use client'

import { useState } from 'react'
import { Select, type SelectOption } from '@/shared/ui/Select'

type Language = 'English' | 'Russian'

const languageOptions: SelectOption[] = [
  { value: 'English', label: 'English', iconSrc: '/icons/flags/flag-united-kingdom.svg' },
  { value: 'Russian', label: 'Russian', iconSrc: '/icons/flags/flag-russia.svg' },
]

export const HeaderLanguageSelect = () => {
  const [language, setLanguage] = useState<Language>('English')

  return (
    <Select
      options={languageOptions}
      value={language}
      onChange={value => setLanguage(value as Language)}
    />
  )
}
