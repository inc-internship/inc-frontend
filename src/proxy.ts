import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale, type Locale } from '@/shared/i18n/config'

const ACCEPT_LANGUAGE_SEPARATOR = ','
const LANGUAGE_TAG_SEPARATOR = '-'
const QUALITY_VALUE_SEPARATOR = ';'

const getLocaleFromAcceptLanguage = (acceptLanguageHeader: string | null): Locale => {
  if (!acceptLanguageHeader) {
    return DEFAULT_LOCALE
  }

  const requestedLanguages = acceptLanguageHeader
    .split(ACCEPT_LANGUAGE_SEPARATOR)
    .map(part => part.trim().toLowerCase())
    .map(part => part.split(QUALITY_VALUE_SEPARATOR)[0])

  for (const language of requestedLanguages) {
    const baseLanguage = language.split(LANGUAGE_TAG_SEPARATOR)[0]

    if (isLocale(baseLanguage)) {
      return baseLanguage
    }
  }

  return DEFAULT_LOCALE
}

const getPreferredLocale = (request: NextRequest): Locale => {
  return getLocaleFromAcceptLanguage(request.headers.get('accept-language'))
}

const hasLocalePrefix = (pathname: string) => {
  return SUPPORTED_LOCALES.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (hasLocalePrefix(pathname)) {
    return
  }

  const locale = getPreferredLocale(request)
  request.nextUrl.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`

  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)'],
}
