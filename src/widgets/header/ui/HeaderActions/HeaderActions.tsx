'use client'

import s from '../Header.module.scss'
import { BellIcon } from '../icons/BellIcon'
import { Select, SelectOption } from '@/shared/ui/Select'
import { useState } from 'react'

type LanguageType = 'English' | 'Russian'

const languages: SelectOption[] = [
  { value: 'English', label: 'English', iconSrc: '/icons/flags/flag-united-kingdom.svg' },
  { value: 'Russian', label: 'Russian', iconSrc: '/icons/flags/flag-russia.svg' },
]

export const HeaderActions = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>('English')

  return (
    <div className={s.actions}>
      {/*<BellIcon />*/}
      <Select
        options={languages}
        value={currentLanguage}
        onChange={language => setCurrentLanguage(language as LanguageType)}
      />
    </div>
  )
}
