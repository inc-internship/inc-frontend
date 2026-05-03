import { PrivateOnly } from '@/app/providers/auth'
import { PrivateHeader } from '@/widgets/header'

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PrivateOnly>
      <>
        <PrivateHeader />
        {children}
      </>
    </PrivateOnly>
  )
}
