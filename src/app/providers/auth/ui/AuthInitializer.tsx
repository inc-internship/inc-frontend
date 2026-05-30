'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLazyGetMeQuery, useRefreshTokenMutation } from '@/entities/auth'
import { clearUser, selectUser, setInitialized, setUser } from '@/entities/user/user.slice'
import { useAppDispatch, useAppSelector } from '@/shared/store'
import { clearAuthHintCookie, setAuthHintCookie } from '@/shared/lib/authHintCookie'

export const AuthInitializer = () => {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const user = useAppSelector(selectUser)

  const [getMe] = useLazyGetMeQuery()
  const [refreshToken] = useRefreshTokenMutation()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const hash = window.location.hash

        if (hash.startsWith('#')) {
          const params = new URLSearchParams(hash.slice(1))
          const accessTokenFromHash = params.get('accessToken')

          if (accessTokenFromHash) {
            localStorage.setItem('accessToken', accessTokenFromHash)

            window.history.replaceState(
              null,
              '',
              `${window.location.pathname}${window.location.search}`,
            )
          }
        }

        let accessToken = localStorage.getItem('accessToken')

        if (!accessToken) {
          const refreshResponse = await refreshToken().unwrap()

          localStorage.setItem('accessToken', refreshResponse.accessToken)
          accessToken = refreshResponse.accessToken
        }

        if (user) {
          setAuthHintCookie()
          dispatch(setInitialized(true))
          return
        }

        if (accessToken) {
          const me = await getMe().unwrap()

          setAuthHintCookie()
          dispatch(setUser(me))
        }
      } catch (error) {
        console.error('[Auth init error] ', error)
        clearAuthHintCookie()
        localStorage.removeItem('accessToken')
        dispatch(clearUser())
      } finally {
        dispatch(setInitialized(true))
      }
    }

    initAuth()
  }, [dispatch, getMe, pathname, refreshToken, user])

  return null
}
