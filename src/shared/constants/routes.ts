import { type Locale } from '@/shared/i18n/config'
import { getLocalizedPath } from '@/shared/i18n/routing'

export const ROUTES = {
  main: '/',
  profileSettings: '/profile-settings',
  statistics: '/statistics',
  favorites: '/favorites',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  recoveryPassword: '/recovery-password',
  createNewPassword: '/create-new-password',
  emailConfirmed: '/email-confirmed',
  verificationLinkExpired: '/verification-link-expired',
  termsOfService: '/terms-of-service',
  privacyPolicy: '/privacy-policy',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

export const getLocalizedRoute = (locale: Locale, route: RoutePath) => {
  return getLocalizedPath(locale, route)
}
