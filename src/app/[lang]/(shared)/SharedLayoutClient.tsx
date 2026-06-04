'use client'

import { selectIsInitialized, selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { Sidebar } from '@/widgets/sidebar'
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
        <div className={s.page}>
          <Sidebar />
          <main className={s.content}>{children}</main>
        </div>
      ) : isAuthPending ? (
        <div className={s.page}>
          <SidebarSkeleton />
          <main className={s.content}>{children}</main>
        </div>
      ) : (
        <div className={s.publicPage}>{children}</div>
      )}
    </>
  )
}
