import React from 'react'
import { SignUpForm } from '@/features/sign-up'
import { SignUpConfirmed } from '@/features/sign-up/ui/SignUpConfirmed/SignUpConfirmed'
import { SignUpResend } from '@/features/sign-up/ui/SignUpResend/SignUpResend'

export const SignUpPage = () => {
  return (
    <>
      <SignUpForm />
      <SignUpConfirmed />
      <SignUpResend />
    </>
  )
}
