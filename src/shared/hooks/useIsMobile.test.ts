import { act, renderHook } from '@testing-library/react'

import { useIsMobile } from './useIsMobile'

type MatchMediaMock = {
  matches: boolean
  trigger: () => void
}

const mockMatchMedia = (matches: boolean): MatchMediaMock => {
  const listeners = new Set<() => void>()
  const mq = {
    matches,
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
  }

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => mq,
  })

  return {
    get matches() {
      return mq.matches
    },
    trigger: () => {
      mq.matches = !mq.matches
      listeners.forEach(cb => cb())
    },
  }
}

describe('useIsMobile', () => {
  it('returns false on desktop viewport', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('returns true on mobile viewport', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('updates when viewport crosses the breakpoint', () => {
    const mq = mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    act(() => mq.trigger())

    expect(result.current).toBe(true)
  })

  it('cleans up the listener on unmount', () => {
    const listeners = new Set<() => void>()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: false,
        addEventListener: (_: string, cb: () => void) => listeners.add(cb),
        removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
      }),
    })

    const { unmount } = renderHook(() => useIsMobile())

    expect(listeners.size).toBe(1)

    unmount()

    expect(listeners.size).toBe(0)
  })
})
