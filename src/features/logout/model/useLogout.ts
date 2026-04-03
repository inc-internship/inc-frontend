'use client'

import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/entities/auth/api/auth.api'
// import {useAppDispatch} from "@/app/providers/store/lib/useAppDispatch";

export const useLogout = () => {
  const [logout, { isLoading }] = useLogoutMutation()
  const router = useRouter()
  // const dispatch = useAppDispatch()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      localStorage.removeItem('accessToken') // под каким ключем сохранение если есть, или зачистить state
      //dispatch(clearAuth()) // когда появиться redux
      router.push('/login')
    } catch (error) {
      console.log('Logout failed', error)
    }
  }
  return { handleLogout, isLoading }
}
