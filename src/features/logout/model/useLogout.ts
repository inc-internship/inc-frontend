'use client'

import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/entities/auth/api/auth.api'

export const useLogout = () => {
  const [logout, { isLoading }] = useLogoutMutation()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      localStorage.removeItem('accessToken')
      router.push('/login')
    } catch (error) {
      console.log('Logout failed', error)
    }
  }
  return { handleLogout, isLoading }
}
