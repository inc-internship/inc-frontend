'use client'

import { FormEvent, useState } from 'react'
import s from './CreateNewPasswordPage.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Form, FormActions, FormAssist, FormFields } from '@/shared/ui/Form'

const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 20

export const CreateNewPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const hasPasswordMismatch = isSubmitted && newPassword !== passwordConfirmation
  const hasPasswordLengthError =
    isSubmitted &&
    (newPassword.length < MIN_PASSWORD_LENGTH || newPassword.length > MAX_PASSWORD_LENGTH)

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)

    if (hasPasswordMismatch || hasPasswordLengthError) {
      return
    }
  }

  return (
    <section className={s.section}>
      <div className={s.card}>
        <Form className={s.form} noValidate={true} onSubmit={submitHandler}>
          <Typography variant="h1" className={s.title}>
            Create New Password
          </Typography>

          <FormFields className={s.fields}>
            <Input
              type="password"
              label="New password"
              placeholder="******************"
              autoComplete="new-password"
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              error={
                hasPasswordLengthError
                  ? `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`
                  : undefined
              }
            />
            <Input
              type="password"
              label="Password confirmation"
              placeholder="******************"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={event => setPasswordConfirmation(event.target.value)}
              error={hasPasswordMismatch ? 'The passwords must match' : undefined}
            />
          </FormFields>

          <FormAssist className={s.assist}>
            <Typography variant="text-m" className={s.description}>
              Your password must be between 6 and 20 characters
            </Typography>
          </FormAssist>

          <FormActions className={s.actions}>
            <Button variant="primary" className={s.button} type="submit">
              Create new password
            </Button>
          </FormActions>
        </Form>
      </div>
    </section>
  )
}
