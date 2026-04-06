'use client'

import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import { ForgotPasswordForm } from '@/features/forgot-password'
import s from './ForgotPasswordPage.module.scss'
import Link from 'next/link'
import { Button } from '@/shared/ui/Button'

export const ForgotPasswordPage = () => (
  <main className={s.main}>
    <Card>
      <Typography variant="h1" align="center" className={s.title}>
        Forgot Password
      </Typography>
      <ForgotPasswordForm />
      <Button asChild={true} variant="default" fullWidth={true} className={s.signInButton}>
        <Link href="/login" className={s.link}>
          Back to Sign In
        </Link>
      </Button>
    </Card>
  </main>
)
