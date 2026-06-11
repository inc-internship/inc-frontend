'use client'

import { useMemo } from 'react'
import { CheckBox } from '@/shared/ui/CheckBox'
import s from './AccountManagementPage.module.scss'
import { accountTypeOptions } from './accountManagement.constants'
import { CreatePaymentModal } from './CreatePaymentModal'
import { CurrentSubscriptionInfo } from './CurrentSubscriptionInfo'
import { PaymentButtons } from './PaymentButtons'
import { PaymentErrorModal } from './PaymentErrorModal'
import { PaymentSuccessModal } from './PaymentSuccessModal'
import { RadioGroup } from './RadioGroup'
import { usePaymentFlow } from './usePaymentFlow'

export const AccountManagementPage = () => {
  const { account, handlers, modals, payment, subscription } = usePaymentFlow()
  const resolvedAccountTypeOptions = useMemo(
    () =>
      accountTypeOptions.map(option =>
        option.value === 'personal' && subscription.hasActiveSubscription
          ? { ...option, disabled: true }
          : option,
      ),
    [subscription.hasActiveSubscription],
  )

  return (
    <div className={s.page}>
      {subscription.currentSubscription && (
        <>
          <CurrentSubscriptionInfo
            expireAt={subscription.currentSubscription.endDateOfSubscription}
            nextPaymentDate={subscription.currentSubscription.nextPaymentDate}
          />
          <CheckBox
            label="Auto-Renewal"
            checked={subscription.isAutoRenewalEnabled}
            disabled={subscription.isAutoRenewalUpdating || !subscription.isAutoRenewalEnabled}
            onCheckedChange={checked => {
              if (checked === false) {
                subscription.onCancelAutoRenewal()
              }
            }}
          />
        </>
      )}

      <RadioGroup
        legend="Account type:"
        name="accountType"
        options={resolvedAccountTypeOptions}
        value={account.accountType}
        onValueChange={account.onAccountTypeChange}
      />

      {account.isBusinessAccount && (
        <div className={s.businessSection}>
          {subscription.options.length > 0 ? (
            <RadioGroup
              legend={
                subscription.hasActiveSubscription
                  ? 'Change your subscription:'
                  : 'Your subscription costs:'
              }
              name="subscriptionPlan"
              options={subscription.options}
              value={subscription.subscriptionPlan}
              onValueChange={subscription.onSubscriptionPlanChange}
            />
          ) : (
            <section>
              <h3 className={s.sectionTitle}>
                {subscription.hasActiveSubscription
                  ? 'Change your subscription:'
                  : 'Your subscription costs:'}
              </h3>
              <div className={s.panel}>
                <p className={s.plansState}>
                  {subscription.isSubscriptionPlansLoading
                    ? 'Loading subscription plans...'
                    : 'Subscription plans are unavailable'}
                </p>
              </div>
            </section>
          )}
          <PaymentButtons
            disabled={payment.isPaymentDisabled}
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
