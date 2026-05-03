import { isLocale, type Locale } from './config'

const normalizePathname = (pathname: string) => {
  if (!pathname) {
    return '/'
  }

  const pathWithLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`

  if (pathWithLeadingSlash.length > 1 && pathWithLeadingSlash.endsWith('/')) {
    return pathWithLeadingSlash.slice(0, -1)
  }

  return pathWithLeadingSlash
}

export const getLocaleFromPathname = (pathname: string): Locale | undefined => {
  const normalizedPathname = normalizePathname(pathname)
  const [firstSegment] = normalizedPathname.split('/').filter(Boolean)

  if (isLocale(firstSegment)) {
    return firstSegment
  }

  return undefined
}

export const stripLocaleFromPathname = (pathname: string) => {
  const normalizedPathname = normalizePathname(pathname)
  const segments = normalizedPathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return '/'
  }

  if (!isLocale(segments[0])) {
    return normalizedPathname
  }

  const pathWithoutLocale = segments.slice(1)

  return pathWithoutLocale.length === 0 ? '/' : `/${pathWithoutLocale.join('/')}`
}

export const getLocalizedPath = (locale: Locale, pathname: string) => {
  const pathnameWithoutLocale = stripLocaleFromPathname(pathname)

  if (pathnameWithoutLocale === '/') {
    return `/${locale}`
  }

  return `/${locale}${pathnameWithoutLocale}`
}

export const replaceLocaleInPathname = (pathname: string, nextLocale: Locale) => {
  return getLocalizedPath(nextLocale, pathname)
}
