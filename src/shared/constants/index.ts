export const ENDPOINTS_WITH_REFRESH = new Set(['getMe'])
export const BASE_URL = process.env.NODE_ENV === 'development' ? '' : 'https://minglo.blog'

export const API_V1_URL = process.env.NODE_ENV === 'development' ? '/api/v1' : `${BASE_URL}/api/v1`
