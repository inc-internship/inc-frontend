'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(max-width: 767.98px)'

const subscribe = (callback: () => void) => {
  const mq = window.matchMedia(QUERY)

  mq.addEventListener('change', callback)

  return () => mq.removeEventListener('change', callback)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => false

export const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
