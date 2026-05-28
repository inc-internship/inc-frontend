'use client'

import { useEffect } from 'react'
import { useLazyGetMeQuery } from '@/entities/auth'
import { clearUser, selectUser, setInitialized, setUser } from '@/entities/user/user.slice'
import { useAppDispatch, useAppSelector } from '@/shared/store'
import { clearAuthHintCookie, setAuthHintCookie } from '@/shared/lib/authHintCookie'

export const AuthInitializer = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const [getMe] = useLazyGetMeQuery()

  useEffect(() => {
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
        setAuthHintCookie()
        dispatch(setUser(me))
      })
      .catch(error => {
        console.error('[Me error] ' + error)
        clearAuthHintCookie()
        localStorage.removeItem('accessToken')
        dispatch(clearUser())
      })
  }, [dispatch, getMe, user])

  return null
}
