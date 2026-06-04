const COOKIE_NAME = 'auth_hint'
const MAX_AGE_30_DAYS = 60 * 60 * 24 * 30

export const setAuthHintCookie = () => {
  document.cookie = `${COOKIE_NAME}=1; path=/; SameSite=Strict; max-age=${MAX_AGE_30_DAYS}`
}

export const clearAuthHintCookie = () => {
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
