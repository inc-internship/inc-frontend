import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AccountManagementPage } from './AccountManagementPage'

describe('AccountManagementPage', () => {
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
})
