'use client'

import type { ReactNode } from 'react'
import { useAppSelector } from '@/shared/store'
import { PageSpinner } from '@/shared/ui/Spinner'
import { selectIsInitialized } from '@/entities/user/user.slice'

type AuthGateProps = Readonly<{
  children: ReactNode
}>

export const AuthGate = ({ children }: AuthGateProps) => {
  const isInitialized = useAppSelector(selectIsInitialized)

  if (!isInitialized) {
    return <PageSpinner />
  }

  return children
}
