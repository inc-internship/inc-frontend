'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { selectIsInitialized, selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { ROUTES } from '@/shared/constants'

type GuestOnlyProps = Readonly<{
  children: ReactNode
}>

export const GuestOnly = ({ children }: GuestOnlyProps) => {
  const router = useRouter()
  const user = useAppSelector(selectUser)
  const isInitialized = useAppSelector(selectIsInitialized)

  useEffect(() => {
    if (user) {
      router.replace(ROUTES.main)
    }
  }, [router, user])

  if (!isInitialized || user) {
    return null
  }

  return children
}
