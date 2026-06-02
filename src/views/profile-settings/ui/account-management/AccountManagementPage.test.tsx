import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AccountManagementPage } from './AccountManagementPage'

const mockCreatePayment = jest.fn()
const mockGetCurrentSubscription = jest.fn()
const mockReplace = jest.fn()
let mockSearchParams = new URLSearchParams()

jest.mock('@/entities/billing', () => ({
  useCreatePaymentMutation: () => [mockCreatePayment, { isLoading: false }],
  useLazyGetCurrentSubscriptionQuery: () => [mockGetCurrentSubscription, { isFetching: false }],
}))

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/profile-settings',
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}))

describe('AccountManagementPage', () => {
  beforeEach(() => {
    mockCreatePayment.mockReset()
    mockGetCurrentSubscription.mockReset()
    mockCreatePayment.mockReturnValue({ unwrap: jest.fn() })
    mockGetCurrentSubscription.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(null),
    })
    mockReplace.mockClear()
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
    expect(screen.getByRole('radio', { name: '$50 per 7 Day' })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: '$100 per month' })).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Pay with PayPal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pay with Stripe' })).toBeInTheDocument()
  })

  it('resets subscription plan when switching back to Business after Personal', async () => {
    const user = userEvent.setup()

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('radio', { name: 'Business' }))
    await user.click(screen.getByRole('radio', { name: '$50 per 7 Day' }))
    await user.click(screen.getByRole('radio', { name: 'Personal' }))
    await user.click(screen.getByRole('radio', { name: 'Business' }))

    expect(screen.getByRole('radio', { name: '$10 per 1 Day' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '$50 per 7 Day' })).not.toBeChecked()
  })

  it('opens Create payment modal and enables OK only after agreement', async () => {
    const user = userEvent.setup()

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('radio', { name: 'Business' }))
    await user.click(screen.getByRole('button', { name: 'Pay with PayPal' }))

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
    await user.click(screen.getByRole('button', { name: 'Pay with PayPal' }))
    await user.click(screen.getByRole('checkbox', { name: 'I agree' }))

    const okButton = screen.getByRole('button', { name: 'OK' })

    await user.dblClick(okButton)

    expect(mockCreatePayment).toHaveBeenCalledTimes(1)
    expect(okButton).toBeDisabled()
  })

  it('loads current subscription once after confirming Success modal', async () => {
    const user = userEvent.setup()

    mockSearchParams = new URLSearchParams('paymentStatus=success')

    render(<AccountManagementPage />)

    expect(screen.getByRole('heading', { name: 'Success' })).toBeInTheDocument()
    expect(mockGetCurrentSubscription).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'OK' }))

    expect(mockGetCurrentSubscription).toHaveBeenCalledTimes(1)
  })

  it('keeps selected plan and clears pending payment after Back to payment', async () => {
    const user = userEvent.setup()

    sessionStorage.setItem(
      'account-management-pending-payment',
      JSON.stringify({ accountType: 'business', subscriptionPlan: 'week' }),
    )
    mockSearchParams = new URLSearchParams('paymentStatus=failed')

    render(<AccountManagementPage />)

    await user.click(screen.getByRole('button', { name: 'Back to payment' }))

    expect(screen.getByRole('radio', { hidden: true, name: 'Business' })).toBeChecked()
    expect(screen.getByRole('radio', { hidden: true, name: '$50 per 7 Day' })).toBeChecked()
    expect(sessionStorage.getItem('account-management-pending-payment')).toBeNull()
  })
})
