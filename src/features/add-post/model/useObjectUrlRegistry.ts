'use client'

import { useEffect, useRef } from 'react'

export const useObjectUrlRegistry = () => {
  const objectUrlsRef = useRef<Set<string>>(new Set())

  const track = (url: string) => {
    objectUrlsRef.current.add(url)

    return url
  }

  const revoke = (url: string) => {
    if (!url.startsWith('blob:')) {
      return
    }

    URL.revokeObjectURL(url)
    objectUrlsRef.current.delete(url)
  }

  useEffect(() => {
    const objectUrls = objectUrlsRef.current

    return () => {
      objectUrls.forEach(url => {
        URL.revokeObjectURL(url)
      })
      objectUrls.clear()
    }
  }, [])

  return {
    track,
    revoke,
  }
}
