import { AuthGate, PrivateOnly } from '@/app/providers/auth'
import { PrivateHeader } from '@/widgets/header'
import { AppShell } from '@/widgets/app-shell'
import { NotificationsProvider } from '@/app/providers/notifications/ui/NotificationsProvider'

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGate>
      <PrivateOnly>
        <NotificationsProvider>
          <PrivateHeader />
          <AppShell>{children}</AppShell>
        </NotificationsProvider>
      </PrivateOnly>
    </AuthGate>
  )
}
