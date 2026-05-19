'use client'

import { useState } from 'react'

import s from './AccountManagementPage.module.scss'
import {
  accountTypeOptions,
  DEFAULT_ACCOUNT_TYPE,
  DEFAULT_SUBSCRIPTION_PLAN,
  subscriptionOptions,
} from './accountManagement.constants'
import type { AccountType, SubscriptionPlan } from './accountManagement.types'
import { PaymentButtons } from './PaymentButtons'
import { RadioGroup } from './RadioGroup'

export const AccountManagementPage = () => {
  const [accountType, setAccountType] = useState<AccountType>(DEFAULT_ACCOUNT_TYPE)
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan>(DEFAULT_SUBSCRIPTION_PLAN)

  const isBusinessAccount = accountType === 'business'

  const accountTypeChangeHandler = (nextAccountType: AccountType) => {
    setAccountType(nextAccountType)

    if (nextAccountType === 'business') {
      setSubscriptionPlan(DEFAULT_SUBSCRIPTION_PLAN)
    }
  }

  return (
    <div className={s.page}>
      <RadioGroup
        legend="Account type:"
        name="accountType"
        options={accountTypeOptions}
        value={accountType}
        onValueChange={accountTypeChangeHandler}
      />

      {isBusinessAccount && (
        <div className={s.businessSection}>
          <RadioGroup
            legend="Your subscription costs:"
            name="subscriptionPlan"
            options={subscriptionOptions}
            value={subscriptionPlan}
            onValueChange={setSubscriptionPlan}
          />
          <PaymentButtons />
        </div>
      )}
    </div>
  )
}
