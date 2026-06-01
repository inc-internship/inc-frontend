'use client'

import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { PublicHeader } from '@/widgets/header'
import { PrivateHeader } from '@/widgets/header'
import { HeaderSkeleton } from './HeaderSkeleton'

type Props = {
  isAuthPending: boolean
}

export const SharedHeader = ({ isAuthPending }: Props) => {
  const user = useAppSelector(selectUser)

  if (isAuthPending) return <HeaderSkeleton />
  return user ? <PrivateHeader /> : <PublicHeader />
}
