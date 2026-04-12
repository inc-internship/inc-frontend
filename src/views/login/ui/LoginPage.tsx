'use client'

import { LoginForm } from '@/features/login'
import { FormSocials } from '@/shared/ui/FormSocials'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { Typography } from '@/shared/ui/Typography'
import { Card } from '@/shared/ui/Card'
import { ROUTES } from '@/shared/constants'
import s from './LoginPage.module.scss'

export const LoginPage = () => (
  <main className={s.main}>
    <Card className={s.loginCard}>
      <Typography variant="h1" align="center" className={s.title}>
        Sign in
      </Typography>
      <FormSocials />
      <LoginForm />
      <Typography variant="text-l" align="center">
        Don&#39;t have an account?
      </Typography>
      <Button asChild={true} fullWidth={true}>
        <Link href={ROUTES.register}>Sign Up</Link>
      </Button>
    </Card>
  </main>
)
