'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { selectIsInitialized, selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { ROUTES, getLocalizedRoute } from '@/shared/constants'
import { PageSpinner } from '@/shared/ui/Spinner'
import { useI18n } from '@/shared/i18n'

type PrivateOnlyProps = Readonly<{
  children: ReactNode
}>

export const PrivateOnly = ({ children }: PrivateOnlyProps) => {
  const router = useRouter()
  const { locale } = useI18n()
  const user = useAppSelector(selectUser)
  const isInitialized = useAppSelector(selectIsInitialized)

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace(getLocalizedRoute(locale, ROUTES.login))
    }
  }, [isInitialized, locale, router, user])

  if (!isInitialized || !user) {
    return <PageSpinner />
  }

  return children
}
