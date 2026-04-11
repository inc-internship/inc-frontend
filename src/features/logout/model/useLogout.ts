'use client'

import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/entities/auth/api/auth.api'
import { useAppDispatch } from '@/shared/store'
import { clearUser } from '@/entities/user/user.slice'
import { ROUTES } from '@/shared/constants'

export const useLogout = () => {
  const [logout, { isLoading }] = useLogoutMutation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    await logout()
    localStorage.removeItem('accessToken')
    dispatch(clearUser())
    router.replace(ROUTES.login)
  }

  return { handleLogout, isLoading }
}
