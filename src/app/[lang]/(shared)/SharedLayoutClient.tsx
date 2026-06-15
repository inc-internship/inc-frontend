'use client'

import { selectIsInitialized, selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { AppShell } from '@/widgets/app-shell'
import { SidebarSkeleton } from '@/widgets/sidebar/ui/SidebarSkeleton'
import { SharedHeader } from '@/widgets/header/shared-header'
import s from './layout.module.scss'

type Props = {
  children: React.ReactNode
  hasAuthHint: boolean
}

export const SharedLayoutClient = ({ children, hasAuthHint }: Props) => {
  const user = useAppSelector(selectUser)
  const isInitialized = useAppSelector(selectIsInitialized)

  const isAuthPending = hasAuthHint && !isInitialized

  return (
    <>
      <SharedHeader isAuthPending={isAuthPending} />
      {user ? (
        <AppShell>{children}</AppShell>
      ) : isAuthPending ? (
        <AppShell sidebar={<SidebarSkeleton />}>{children}</AppShell>
      ) : (
        <div className={s.publicPage}>{children}</div>
      )}
    </>
  )
}
