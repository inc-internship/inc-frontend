'use client'

import s from './ForgotPasswordForm.module.scss'
import { Form, FormActions, FormAssist, FormFields, FormFooter } from '@/shared/ui/Form'
import { Typography } from '@/shared/ui/Typography'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'

export const ForgotPasswordForm = () => (
  <form>
    <div className={s.formFields}>
      <Input type="email" label="Email" placeholder="Epam@epam.com" />
      <Typography variant="text-m" className={s.assistText}>
        Enter your email address and we will send you further instructions
      </Typography>
      <Button variant="primary" type="submit" className={s.submitButton}>
        Send Link
      </Button>
    </div>
  </form>
)
