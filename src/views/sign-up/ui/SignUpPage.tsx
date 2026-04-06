'use client'

import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import { FormSocials } from '@/shared/ui/FormSocials'
import { SignUpForm } from '@/features/sign-up'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import s from './SignUpPage.module.scss'

export const SignUpPage = () => (
  <main className={s.main}>
    <Card className={s.card}>
      <Typography className={s.title} variant="h1" align="center">
        Sign Up
      </Typography>
      <FormSocials />
      <SignUpForm />
      <Typography variant="text-l" className={s.footerInfo}>
        Do you have an account?
      </Typography>
      <Button variant="default" className={s.footerBtn} type="button" asChild={true}>
        <Link href="/login">Sign In</Link>
      </Button>
    </Card>
  </main>
)
