'use client'

import { selectUser } from '@/entities/user/user.slice'
import { PageSpinner } from '@/shared/ui/Spinner'
import { useAppSelector } from '@/shared/store'
import { useSharedAuthGuard } from '@/app/providers/auth'
import { Sidebar } from '@/widgets/sidebar'
import { SharedHeader } from '@/widgets/header/shared-header'
import s from './layout.module.scss'

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = useAppSelector(selectUser)
  const { shouldBlockAuthDependentUi } = useSharedAuthGuard()

  if (shouldBlockAuthDependentUi) {
    return <PageSpinner />
  }

  return (
    <>
      <SharedHeader />
      {user ? (
        <div className={s.page}>
          <Sidebar />
          <main className={s.content}>{children}</main>
        </div>
      ) : (
        <div className={s.publicPage}>{children}</div>
      )}
    </>
  )
}
