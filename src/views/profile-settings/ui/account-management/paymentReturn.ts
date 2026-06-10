export type PaymentReturnStatus = 'error' | 'success'

type SearchParamsReader = {
  get: (name: string) => string | null
}

const successStatuses = new Set(['success', 'succeeded', 'paid'])
const errorStatuses = new Set(['error', 'failed', 'cancelled', 'canceled'])
const paymentStatusParams = ['paymentStatus', 'payment_status', 'payment', 'status', 'result']

const normalizePaymentStatus = (status: string | null) => {
  return status?.trim().toLowerCase() ?? null
}

export const getPaymentReturnStatus = (
  searchParams: SearchParamsReader,
): PaymentReturnStatus | null => {
  const rawStatus =
    searchParams.get('paymentStatus') ??
    searchParams.get('payment_status') ??
    searchParams.get('payment') ??
    searchParams.get('status') ??
    searchParams.get('result')
  const normalizedStatus = normalizePaymentStatus(rawStatus)

  if (successStatuses.has(normalizedStatus ?? '')) {
    return 'success'
  }

  if (errorStatuses.has(normalizedStatus ?? '')) {
    return 'error'
  }

  return null
}

export const getSearchParamsWithoutPaymentStatus = (searchParamsString: string) => {
  const params = new URLSearchParams(searchParamsString)

  paymentStatusParams.forEach(param => params.delete(param))

  return params.toString()
}
