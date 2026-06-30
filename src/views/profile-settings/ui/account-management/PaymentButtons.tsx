import Image from 'next/image'

import s from './AccountManagementPage.module.scss'
import type { PaymentProvider } from './accountManagement.types'

type Props = {
  disabled?: boolean
  isPaypalDisabled?: boolean
  onPaymentClick: (provider: PaymentProvider) => void
}

export const PaymentButtons = ({
  disabled = false,
  isPaypalDisabled = true,
  onPaymentClick,
}: Props) => {
  return (
    <div className={s.paymentButtons}>
      <button
        className={s.paymentButton}
        type="button"
        aria-label="Pay with PayPal"
        disabled={disabled || isPaypalDisabled}
        title={isPaypalDisabled ? 'PayPal is not available' : undefined}
        onClick={() => onPaymentClick('paypal')}
      >
        <Image
          className={s.paymentIcon}
          src="/icons/payments/paypal.svg"
          width={96}
          height={64}
          alt=""
        />
      </button>
      <span className={s.paymentSeparator}>Or</span>
      <button
        className={s.paymentButton}
        type="button"
        aria-label="Pay with Stripe"
        disabled={disabled}
        onClick={() => onPaymentClick('stripe')}
      >
        <Image
          className={s.paymentIcon}
          src="/icons/payments/stripe.svg"
          width={96}
          height={64}
          alt=""
        />
      </button>
    </div>
  )
}
