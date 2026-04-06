import { Suspense } from 'react'
import { EmailConfirmedClientPage } from './EmailConfirmedClientPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Email confirmed',
}

export default function EmailConfirmed() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailConfirmedClientPage />
    </Suspense>
  )
}
