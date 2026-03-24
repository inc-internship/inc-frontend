'use client'

import { useState } from 'react'
import { SignUpForm } from '../SignUpForm/SignUpForm'
import { SignUpConfirmed } from '../SignUpConfirmed/SignUpConfirmed'
import { SignUpResend } from '../SignUpResend/SignUpResend'
import type { SignUpStep } from '../../model/types'

type Props = {
  /** Step used on first render. */
  initialStep?: SignUpStep
}

/** Controls sign-up screen states: form, confirmed, and resend. */
export const SignUpFlow = ({ initialStep = 'form' }: Props) => {
  const [step, setStep] = useState<SignUpStep>(initialStep)

  if (step === 'confirmed') {
    return <SignUpConfirmed />
  }

  if (step === 'resend') {
    return <SignUpResend onSuccess={() => setStep('confirmed')} />
  }

  return <SignUpForm onSuccess={() => setStep('confirmed')} />
}
