'use client'

import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { PublicHeader } from '@/widgets/header'
import { PrivateHeader } from '@/widgets/header'

export const SharedHeader = () => {
  const user = useAppSelector(selectUser)

  return user ? <PrivateHeader /> : <PublicHeader />
}
