'use client'

import { Select, type SelectOption } from '@/shared/ui/Select'
import { useI18n } from '@/shared/i18n'

type Props = {
  value: string | null
  onChange: (value: string | null) => void
  options: SelectOption[]
  allValue: string
}

export const BlockedFilter = ({ value, onChange, options, allValue }: Props) => {
  const { t } = useI18n()

  const selectValue = value === null ? allValue : value

  const handleChange = (newValue: string) => {
    onChange(newValue === allValue ? null : newValue)
  }

  return (
    <Select
      options={options}
      value={selectValue}
      onChange={handleChange}
      placeholder={t('blockedFilter.notSelected')}
    />
  )
}
