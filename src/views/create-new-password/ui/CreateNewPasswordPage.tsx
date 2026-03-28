'use client'

import { FormEvent, useState } from 'react'
import s from './CreateNewPasswordPage.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Form, FormActions, FormFields } from '@/shared/ui/Form'

export const CreateNewPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const hasPasswordMismatch = isSubmitted && newPassword !== passwordConfirmation

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <section className={s.section}>
      <div className={`${s.card} ${hasPasswordMismatch ? s.cardError : ''}`}>
        <Form className={s.form} onSubmit={submitHandler}>
          <Typography variant="h1" className={s.title}>
            Create New Password
          </Typography>

          <FormFields className={s.fields}>
            <Input
              type="password"
              label="New password"
              placeholder="******************"
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
            />
            <Input
              type="password"
              label="Password confirmation"
              placeholder="******************"
              value={passwordConfirmation}
              onChange={event => setPasswordConfirmation(event.target.value)}
              error={hasPasswordMismatch ? 'The passwords must match' : undefined}
            />
          </FormFields>

          <Typography variant="text-m" className={s.description}>
            Your password must be between 6 and 20 characters
          </Typography>

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
