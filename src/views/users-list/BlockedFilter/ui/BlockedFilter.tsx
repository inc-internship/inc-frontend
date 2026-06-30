'use client'

import { useState } from 'react'
import { Select } from '@/shared/ui/Select'
import { useI18n } from '@/shared/i18n'

export const BlockedFilter = () => {
  const { t } = useI18n()
  const [selected, setSelected] = useState<string | null>(null)

  const options = [
    { value: 'blocked', label: t('blockedFilter.blocked') },
    { value: 'not_blocked', label: t('blockedFilter.notBlocked') },
  ]

  return (
    <Select
      options={options}
      value={selected}
      onChange={newValue => setSelected(newValue)}
      placeholder={t('blockedFilter.notSelected')}
    />
  )
}
