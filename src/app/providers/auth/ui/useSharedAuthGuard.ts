'use client'

import { useSyncExternalStore } from 'react'
import { selectIsInitialized } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'

const emptySubscribe = () => () => undefined

export const useSharedAuthGuard = () => {
  const isInitialized = useAppSelector(selectIsInitialized)
  const hasStoredAccessToken = useSyncExternalStore(
    emptySubscribe,
    () => Boolean(localStorage.getItem('accessToken')),
    () => true,
  )

  const shouldBlockAuthDependentUi = !isInitialized && hasStoredAccessToken

  return { shouldBlockAuthDependentUi }
}
