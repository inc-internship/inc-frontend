'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLazyGetMeQuery } from '@/entities/auth'
import { clearUser, selectUser, setInitialized, setUser } from '@/entities/user/user.slice'
import { useAppDispatch, useAppSelector } from '@/shared/store'

export const AuthInitializer = () => {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
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
        dispatch(setUser(me))
      })
      .catch(() => {
        localStorage.removeItem('accessToken')
        dispatch(clearUser())
      })
  }, [dispatch, getMe, pathname, user])

  return null
}
