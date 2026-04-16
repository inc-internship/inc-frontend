'use client'

import { selectUser } from '@/entities/user/user.slice'
import { useAppSelector } from '@/shared/store'
import { Sidebar } from '@/widgets/sidebar'
import { SharedHeader } from '@/widgets/header/shared-header'
import s from './layout.module.scss'

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = useAppSelector(selectUser)

  return (
    <>
      <SharedHeader />
      {user ? (
        <div className={s.page}>
          <Sidebar />
          <main className={s.content}>{children}</main>
        </div>
      ) : (
        children
      )}
    </>
  )
}
