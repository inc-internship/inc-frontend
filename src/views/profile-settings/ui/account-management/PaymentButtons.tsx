import Image from 'next/image'

import s from './AccountManagementPage.module.scss'

export const PaymentButtons = () => {
  return (
    <div className={s.paymentButtons}>
      <button className={s.paymentButton} type="button" aria-label="Pay with PayPal">
        <Image
          className={s.paymentIcon}
          src="/icons/payments/paypal.svg"
          width={96}
          height={64}
          alt=""
        />
      </button>
      <span className={s.paymentSeparator}>Or</span>
      <button className={s.paymentButton} type="button" aria-label="Pay with Stripe">
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
