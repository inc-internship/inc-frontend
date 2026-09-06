import { MessengerPage } from '@/views/messenger'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Messenger',
}

export default function Messenger() {
  return (
    <Suspense fallback={null}>
      <MessengerPage />
    </Suspense>
  )
}
