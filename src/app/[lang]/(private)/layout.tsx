import { AuthGate, PrivateOnly } from '@/app/providers/auth'
import { PrivateHeader } from '@/widgets/header'

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGate>
      <PrivateOnly>
        <>
          <PrivateHeader />
          {children}
        </>
      </PrivateOnly>
    </AuthGate>
  )
}
