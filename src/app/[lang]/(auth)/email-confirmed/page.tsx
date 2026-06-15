import { EmailConfirmedClientPage } from './EmailConfirmedClientPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Email confirmed',
}

type Props = {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ code?: string | string[] }>
}

export default async function EmailConfirmed({ searchParams }: Props) {
  const { code } = await searchParams
  const confirmationCode = Array.isArray(code) ? code[0] : code

  return <EmailConfirmedClientPage code={confirmationCode ?? null} />
}
