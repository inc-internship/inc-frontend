export const ALL_VALUE = 'all'

export const getBlockedFilterOptions = (t: (key: string) => string) => [
  { value: ALL_VALUE, label: t('blockedFilter.notSelected') },
  { value: 'blocked', label: t('blockedFilter.blocked') },
  { value: 'not_blocked', label: t('blockedFilter.notBlocked') },
]
