'use client'

import { useEffect } from 'react'
import { useLazyGetMeQuery } from '@/entities/auth'
import { clearUser, selectUser, setInitialized, setUser } from '@/entities/user/user.slice'
import { useAppDispatch, useAppSelector } from '@/shared/store'

export const AuthInitializer = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const [getMe] = useLazyGetMeQuery()

  useEffect(() => {
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

    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      dispatch(clearUser())
      return
    }

    if (user) {
      dispatch(setInitialized(true))
      return
    }

    getMe()
      .unwrap()
      .then(me => {
        dispatch(setUser(me))
      })
      .catch(() => {
        localStorage.removeItem('accessToken')
        dispatch(clearUser())
      })
  }, [dispatch, getMe, user])

  return null
}
