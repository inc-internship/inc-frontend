import { cookies } from 'next/headers'
import { SharedLayoutClient } from './SharedLayoutClient'

export default async function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const hasAuthHint = cookieStore.has('auth_hint')

  return <SharedLayoutClient hasAuthHint={hasAuthHint}>{children}</SharedLayoutClient>
}
