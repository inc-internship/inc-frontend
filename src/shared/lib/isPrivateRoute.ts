import { ROUTES } from '@/shared/constants'
import { stripLocaleFromPathname } from '@/shared/i18n'

const PRIVATE_ROUTES = [ROUTES.profileSettings, ROUTES.statistics, ROUTES.favorites]

export const isPrivateRoute = (pathname: string): boolean => {
  const normalizedPath = stripLocaleFromPathname(pathname)

  return PRIVATE_ROUTES.some(route => {
    return normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  })
}
