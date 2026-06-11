import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'

import { AccountManagementPage } from './AccountManagementPage'

const mockCancelAutoRenewal = jest.fn()
const mockCreatePayment = jest.fn()
const mockRefetchCurrentSubscription = jest.fn()
const mockReplace = jest.fn()
let mockLocale = 'ru'
let mockSubscriptionPlans = [
  { currency: 'USD', durationDays: 1, id: 'day-plan-id', name: '1 Day', price: '10' },
  { currency: 'USD', durationDays: 7, id: 'week-plan-id', name: '1 Week', price: '50' },
  { currency: 'USD', durationDays: 30, id: 'month-plan-id', name: '1 Month', price: '100' },
]
let mockCurrentSubscription: null | {
  autoRenewal: boolean
  endDateOfSubscription?: string
  nextPaymentDate?: string
  planName?: string
} = null
let mockSearchParams = new URLSearchParams()

jest.mock('@/entities/billing', () => ({
  useCancelAutoRenewalMutation: () => [mockCancelAutoRenewal, { isLoading: false }],
  useCreatePaymentMutation: () => [mockCreatePayment, { isLoading: false }],
  useGetCurrentSubscriptionQuery: () => ({
    data: mockCurrentSubscription,
    isFetching: false,
    refetch: mockRefetchCurrentSubscription,
  }),
  useGetSubscriptionPlansQuery: () => ({
    data: mockSubscriptionPlans,
    isFetching: false,
  }),
}))

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}))

jest.mock('@/shared/i18n', () => ({
  useI18n: () => ({
    locale: mockLocale,
    setLocale: jest.fn(),
    t: (key: string) => key,
  }),
}))

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/profile-settings',
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}))

describe('AccountManagementPage', () => {
  beforeEach(() => {
    mockCancelAutoRenewal.mockReset()
    mockCreatePayment.mockReset()
    mockRefetchCurrentSubscription.mockReset()
    ;(toast.error as jest.Mock).mockClear()
    mockCancelAutoRenewal.mockReturnValue({ unwrap: jest.fn().mockResolvedValue(undefined) })
    mockCreatePayment.mockReturnValue({ unwrap: jest.fn() })
    mockRefetchCurrentSubscription.mockReturnValue({ unwrap: jest.fn().mockResolvedValue(null) })
    mockReplace.mockClear()
    mockLocale = 'ru'
    mockSubscriptionPlans = [
      { currency: 'USD', durationDays: 1, id: 'day-plan-id', name: '1 Day', price: '10' },
      { currency: 'USD', durationDays: 7, id: 'week-plan-id', name: '1 Week', price: '50' },
      { currency: 'USD', durationDays: 30, id: 'month-plan-id', name: '1 Month', price: '100' },
    ]
    mockCurrentSubscription = null
    mockSearchParams = new URLSearchParams()
    sessionStorage.clear()
  })

  it('shows Personal account type by default without subscription controls', () => {
    render(<AccountManagementPage />)

    expect(screen.getByRole('radio', { name: 'Personal' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Business' })).not.toBeChecked()
    expect(screen.getByText('Account type:')).toBeInTheDocument()
    expect(screen.queryByText('Your subscription costs:')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Pay with PayPal' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Pay with Stripe' })).not.toBeInTheDocument()
  })

  it('shows subscription controls and payment buttons after selecting Business', async () => {
    const user = userEvent.setup()

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('radio', { name: 'Business' }))

    expect(screen.getByRole('radio', { name: 'Business' })).toBeChecked()
    expect(screen.getByText('Your subscription costs:')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '$10 per 1 Day' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '$50 per 7 Days' })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: '$100 per month' })).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Pay with PayPal' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Pay with Stripe' })).toBeEnabled()
  })

  it('shows backend plans with unknown duration without dropping them', async () => {
    const user = userEvent.setup()

    mockSubscriptionPlans = [
      {
        currency: 'USD',
        durationDays: 14,
        id: 'two-weeks-plan-id',
        name: '2 Weeks',
        price: '19.90',
      },
    ]

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('radio', { name: 'Business' }))

    expect(screen.getByRole('radio', { name: '$19.90 per 14 Days' })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Pay with Stripe' })).toBeEnabled()
  })

  it('does not show fallback prices when subscription plans are unavailable', async () => {
    const user = userEvent.setup()

    mockSubscriptionPlans = []

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('radio', { name: 'Business' }))

    expect(screen.getByText('Subscription plans are unavailable')).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: '$10 per 1 Day' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pay with Stripe' })).toBeDisabled()
  })

  it('shows placeholder instead of raw invalid subscription dates', () => {
    mockCurrentSubscription = {
      autoRenewal: false,
      endDateOfSubscription: 'N/A',
      nextPaymentDate: 'undefined',
      planName: '1 Day',
    }

    render(<AccountManagementPage />)

    const currentSubscriptionSection = within(
      screen.getByRole('region', { name: 'Current Subscription:' }),
    )

    expect(currentSubscriptionSection.getAllByText('-')).toHaveLength(2)
    expect(currentSubscriptionSection.queryByText('N/A')).not.toBeInTheDocument()
    expect(currentSubscriptionSection.queryByText('undefined')).not.toBeInTheDocument()
  })

  it('formats subscription dates with english locale', () => {
    mockLocale = 'en'
    mockCurrentSubscription = {
      autoRenewal: true,
      endDateOfSubscription: '2026-06-12T00:00:00.000Z',
      nextPaymentDate: '2026-06-13T00:00:00.000Z',
      planName: '1 Month',
    }

    render(<AccountManagementPage />)

    const currentSubscriptionSection = within(
      screen.getByRole('region', { name: 'Current Subscription:' }),
    )

    expect(currentSubscriptionSection.getByText('06/12/2026')).toBeInTheDocument()
    expect(currentSubscriptionSection.getByText('06/13/2026')).toBeInTheDocument()
  })

  it('shows active Business subscription state from backend', () => {
    mockCurrentSubscription = {
      autoRenewal: true,
      endDateOfSubscription: '2026-06-12T00:00:00.000Z',
      nextPaymentDate: '2026-06-13T00:00:00.000Z',
      planName: '1 Month',
    }

    render(<AccountManagementPage />)

    expect(screen.getByText('Current Subscription:')).toBeInTheDocument()
    expect(screen.getByText('Expire at')).toBeInTheDocument()
    expect(screen.getByText('12.06.2026')).toBeInTheDocument()
    expect(screen.getByText('Next payment')).toBeInTheDocument()
    expect(screen.getByText('13.06.2026')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Auto-Renewal' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Personal' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Business' })).toBeChecked()
    expect(screen.getByText('Change your subscription:')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '$100 per month' })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Pay with PayPal' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Pay with Stripe' })).toBeEnabled()
  })

  it('disables auto-renewal after unchecking checkbox', async () => {
    const user = userEvent.setup()

    mockCurrentSubscription = {
      autoRenewal: true,
      endDateOfSubscription: '2026-06-12T00:00:00.000Z',
      planName: '1 Day',
    }

    render(<AccountManagementPage />)

    const autoRenewalCheckbox = screen.getByRole('checkbox', { name: 'Auto-Renewal' })

    await user.click(autoRenewalCheckbox)

    expect(mockCancelAutoRenewal).toHaveBeenCalledTimes(1)
    expect(autoRenewalCheckbox).not.toBeChecked()
  })

  it('rolls back auto-renewal checkbox and shows notification after request error', async () => {
    const user = userEvent.setup()

    mockCurrentSubscription = {
      autoRenewal: true,
      endDateOfSubscription: '2026-06-12T00:00:00.000Z',
      planName: '1 Day',
    }
    mockCancelAutoRenewal.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(new Error('Auto-renewal request failed')),
    })

    render(<AccountManagementPage />)

    const autoRenewalCheckbox = screen.getByRole('checkbox', { name: 'Auto-Renewal' })

    await user.click(autoRenewalCheckbox)

    await waitFor(() => expect(autoRenewalCheckbox).toBeChecked())
    expect(toast.error).toHaveBeenCalledWith('Auto-renewal request failed')
  })

  it('resets subscription plan when switching back to Business after Personal', async () => {
    const user = userEvent.setup()

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('radio', { name: 'Business' }))
    await user.click(screen.getByRole('radio', { name: '$50 per 7 Days' }))
    await user.click(screen.getByRole('radio', { name: 'Personal' }))
    await user.click(screen.getByRole('radio', { name: 'Business' }))

    expect(screen.getByRole('radio', { name: '$10 per 1 Day' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '$50 per 7 Days' })).not.toBeChecked()
  })

  it('opens Create payment modal and enables OK only after agreement', async () => {
    const user = userEvent.setup()

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('radio', { name: 'Business' }))
    await user.click(screen.getByRole('button', { name: 'Pay with Stripe' }))

    expect(screen.getByRole('heading', { name: 'Create payment' })).toBeInTheDocument()
    expect(screen.getByText(/Auto-renewal will be enabled/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled()

    await user.click(screen.getByRole('checkbox', { name: 'I agree' }))

    expect(screen.getByRole('button', { name: 'OK' })).toBeEnabled()
  })

  it('does not create payment after closing Create payment modal', async () => {
    const user = userEvent.setup()

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('radio', { name: 'Business' }))
    await user.click(screen.getByRole('button', { name: 'Pay with Stripe' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(mockCreatePayment).not.toHaveBeenCalled()
    expect(screen.queryByRole('heading', { name: 'Create payment' })).not.toBeInTheDocument()
  })

  it('prevents duplicate payment creation requests', async () => {
    const user = userEvent.setup()
    const neverResolvedPayment = new Promise(() => {})

    mockCreatePayment.mockReturnValue({
      unwrap: jest.fn().mockReturnValue(neverResolvedPayment),
    })

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('radio', { name: 'Business' }))
    await user.click(screen.getByRole('button', { name: 'Pay with Stripe' }))
    await user.click(screen.getByRole('checkbox', { name: 'I agree' }))

    const okButton = screen.getByRole('button', { name: 'OK' })

    await user.dblClick(okButton)

    expect(mockCreatePayment).toHaveBeenCalledTimes(1)
    expect(mockCreatePayment).toHaveBeenCalledWith({ planId: 'day-plan-id' })
    expect(okButton).toBeDisabled()
  })

  it('loads current subscription once after confirming Success modal', async () => {
    const user = userEvent.setup()

    mockSearchParams = new URLSearchParams('payment=success')

    render(<AccountManagementPage />)

    expect(screen.getByRole('heading', { name: 'Success' })).toBeInTheDocument()
    expect(mockRefetchCurrentSubscription).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'OK' }))

    expect(mockRefetchCurrentSubscription).toHaveBeenCalledTimes(1)
    expect(mockReplace).toHaveBeenCalledWith('/en/profile-settings')
  })

  it('shows notification when current subscription refresh fails after Success modal', async () => {
    const user = userEvent.setup()

    mockSearchParams = new URLSearchParams('paymentStatus=success')
    mockRefetchCurrentSubscription.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(new Error('Subscription refresh failed')),
    })

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('button', { name: 'OK' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Subscription refresh failed'))
    expect(mockReplace).toHaveBeenCalledWith('/en/profile-settings')
  })

  it('uses pending subscription plan after Success modal when backend omits plan name', async () => {
    const user = userEvent.setup()

    sessionStorage.setItem(
      'account-management-pending-payment',
      JSON.stringify({ accountType: 'business', subscriptionPlan: 'week-plan-id' }),
    )
    mockSearchParams = new URLSearchParams('paymentStatus=success')
    mockRefetchCurrentSubscription.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        autoRenewal: true,
        endDateOfSubscription: '2026-06-12T00:00:00.000Z',
      }),
    })

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('button', { name: 'OK' }))

    await waitFor(() => {
      expect(screen.getByRole('radio', { hidden: true, name: '$50 per 7 Days' })).toBeChecked()
    })
    expect(mockReplace).toHaveBeenCalledWith('/en/profile-settings')
    expect(sessionStorage.getItem('account-management-pending-payment')).toBeNull()
  })

  it('keeps selected plan and clears pending payment after Back to payment', async () => {
    const user = userEvent.setup()

    sessionStorage.setItem(
      'account-management-pending-payment',
      JSON.stringify({ accountType: 'business', subscriptionPlan: 'week-plan-id' }),
    )
    mockSearchParams = new URLSearchParams('paymentStatus=failed')

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('button', { name: 'Back to payment' }))

    expect(screen.getByRole('radio', { hidden: true, name: 'Business' })).toBeChecked()
    expect(screen.getByRole('radio', { hidden: true, name: '$50 per 7 Days' })).toBeChecked()
    expect(sessionStorage.getItem('account-management-pending-payment')).toBeNull()
  })
})
