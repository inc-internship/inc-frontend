'use client'

import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/entities/auth/api/auth.api'
import { useAppDispatch } from '@/shared/store'
import { clearUser } from '@/entities/user/user.slice'

export const useLogout = () => {
  const [logout, { isLoading }] = useLogoutMutation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      localStorage.removeItem('accessToken')
      dispatch(clearUser())
      router.push('/login')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Logout failed:', error)
      localStorage.removeItem('accessToken')
      dispatch(clearUser())
      router.push('/login')
    }
  }
  return { handleLogout, isLoading }
}
