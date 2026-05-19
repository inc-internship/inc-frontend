import Image from 'next/image'

import s from './AccountManagementPage.module.scss'

export const PaymentButtons = () => {
  return (
    <div className={s.paymentButtons}>
      <button className={s.paymentButton} type="button" aria-label="Pay with PayPal">
        <Image src="/icons/payments/paypal.svg" width={70} height={48} alt="" />
      </button>
      <span className={s.paymentSeparator}>Or</span>
      <button className={s.paymentButton} type="button" aria-label="Pay with Stripe">
        <Image src="/icons/payments/stripe.svg" width={70} height={30} alt="" />
      </button>
    </div>
  )
}
