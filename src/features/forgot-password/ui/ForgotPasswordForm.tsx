'use client'

import s from './ForgotPasswordForm.module.scss'
import { Form, FormActions, FormAssist, FormFields, FormFooter } from '@/shared/ui/Form'
import { Typography } from '@/shared/ui/Typography'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'

export const ForgotPasswordForm = () => {
  return (
    <section className={s.section}>
      <div className={s.card}>
        <Form className={s.form}>
          <Typography variant="h1" className={s.title}>
            Forgot Password
          </Typography>
          <FormFields className={s.fields}>
            <Input type="email" label="Email" placeholder="Epam@epam.com" />
          </FormFields>
          <FormAssist className={s.assist}>
            <Typography variant="text-m" className={s.assistText}>
              Enter your email address and we will send you further instructions
            </Typography>
          </FormAssist>
          <FormActions className={s.actions}>
            <Button variant="primary" type="submit" className={s.submitButton}>
              Send Link
            </Button>
          </FormActions>
          <FormFooter className={s.footer}>
            <Button asChild={true} className={s.signInButton}>
              <Link href="/sign-in">Back to Sign In</Link>
            </Button>
          </FormFooter>
        </Form>
      </div>
    </section>
  )
}
