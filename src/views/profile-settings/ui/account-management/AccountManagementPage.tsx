'use client'

import s from './AccountManagementPage.module.scss'
import { accountTypeOptions, subscriptionOptions } from './accountManagement.constants'
import { CreatePaymentModal } from './CreatePaymentModal'
import { PaymentButtons } from './PaymentButtons'
import { PaymentErrorModal } from './PaymentErrorModal'
import { PaymentSuccessModal } from './PaymentSuccessModal'
import { RadioGroup } from './RadioGroup'
import { usePaymentFlow } from './usePaymentFlow'

export const AccountManagementPage = () => {
  const { account, handlers, modals, payment, subscription } = usePaymentFlow()

  return (
    <div className={s.page}>
      <RadioGroup
        legend="Account type:"
        name="accountType"
        options={accountTypeOptions}
        value={account.accountType}
        onValueChange={account.onAccountTypeChange}
      />

      {account.isBusinessAccount && (
        <div className={s.businessSection}>
          {subscription.isAutoRenewalEnabled && subscription.selectedSubscription && (
            <div className={s.currentSubscription} aria-live="polite">
              <span>Current subscription: {subscription.selectedSubscription.label}</span>
              <span>Auto-renewal enabled</span>
            </div>
          )}
          <RadioGroup
            legend="Your subscription costs:"
            name="subscriptionPlan"
            options={subscriptionOptions}
            value={subscription.subscriptionPlan}
            onValueChange={subscription.onSubscriptionPlanChange}
          />
          <PaymentButtons
            disabled={payment.isCreatePaymentLoading}
            onPaymentClick={handlers.paymentClickHandler}
          />
        </div>
      )}

      <CreatePaymentModal
        open={modals.isCreatePaymentModalOpen}
        isLoading={payment.isCreatePaymentLoading}
        isAgreed={modals.isAgreementAccepted}
        description={modals.createPaymentDescription}
        onAgreementChange={modals.onAgreementChange}
        onConfirm={handlers.paymentConfirmHandler}
        onClose={handlers.createPaymentModalCloseHandler}
      />
      <PaymentSuccessModal
        open={modals.isPaymentSuccessModalOpen}
        isLoading={modals.isPaymentSuccessLoading}
        onConfirm={handlers.paymentSuccessConfirmHandler}
        onClose={handlers.paymentSuccessConfirmHandler}
      />
      <PaymentErrorModal
        open={modals.isPaymentErrorModalOpen}
        onBackToPayment={handlers.backToPaymentHandler}
        onClose={handlers.paymentReturnCloseHandler}
      />
    </div>
  )
}
