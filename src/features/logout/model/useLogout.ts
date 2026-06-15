'use client'

import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/entities/auth/api/auth.api'
import { useAppDispatch } from '@/shared/store'
import { clearUser } from '@/entities/user/user.slice'
import { ROUTES, getLocalizedRoute } from '@/shared/constants'
import { useI18n } from '@/shared/i18n'
import { clearAuthHintCookie } from '@/shared/lib/authHintCookie'

export const useLogout = () => {
  const [logout, { isLoading }] = useLogoutMutation()
  const router = useRouter()
  const { locale } = useI18n()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    await logout()
    clearAuthHintCookie()
    localStorage.removeItem('accessToken')
    dispatch(clearUser())
    router.replace(getLocalizedRoute(locale, ROUTES.login))
  }

  return { handleLogout, isLoading }
}
