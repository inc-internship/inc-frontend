import { AuthGate, PrivateOnly } from '@/app/providers/auth'
import { PrivateHeader } from '@/widgets/header'
import s from './layout.module.scss'
import { Sidebar } from '@/widgets/sidebar'

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGate>
      <PrivateOnly>
        <PrivateHeader />
        <div className={s.container}>
          <Sidebar />
          {children}
        </div>
      </PrivateOnly>
    </AuthGate>
  )
}
