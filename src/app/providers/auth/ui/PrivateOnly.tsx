'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { ROUTES, getLocalizedRoute } from '@/shared/constants'
import { useI18n } from '@/shared/i18n'
import { PageSpinner } from '@/shared/ui/Spinner'

type PrivateOnlyProps = Readonly<{
  children: ReactNode
}>

export const PrivateOnly = ({ children }: PrivateOnlyProps) => {
  const router = useRouter()
  const { locale } = useI18n()
  const user = useAppSelector(selectUser)

  useEffect(() => {
    if (!user) {
      router.replace(getLocalizedRoute(locale, ROUTES.login))
    }
  }, [locale, router, user])

  if (!user) {
    return <PageSpinner />
  }

  return children
}
