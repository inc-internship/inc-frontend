import { AuthGate, PrivateOnly } from '@/app/providers/auth'
import { PrivateHeader } from '@/widgets/header'
import { AppShell } from '@/widgets/app-shell'

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGate>
      <PrivateOnly>
        <PrivateHeader />
        <AppShell>{children}</AppShell>
      </PrivateOnly>
    </AuthGate>
  )
}
