import s from './layout.module.scss'
import { GuestOnly } from '@/app/providers/auth'
import { AuthHeader } from '@/widgets/header'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <GuestOnly>
      <>
        <AuthHeader />
        <div className={s.wrapper}>{children}</div>
      </>
    </GuestOnly>
  )
}
