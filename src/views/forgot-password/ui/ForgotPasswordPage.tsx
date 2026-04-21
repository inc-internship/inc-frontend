'use client'

import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import { ForgotPasswordForm } from '@/features/forgot-password'
import s from './ForgotPasswordPage.module.scss'
import Link from 'next/link'
import { Button } from '@/shared/ui/Button'
import { ROUTES } from '@/shared/constants'
import { useI18n } from '@/shared/i18n'

export const ForgotPasswordPage = () => {
  const { t } = useI18n()

  return (
    <main className={s.main}>
      <Card>
        <Typography variant="h1" align="center" className={s.title}>
          {t('auth.forgotPassword.title')}
        </Typography>
        <ForgotPasswordForm />
        <Button asChild={true} variant="default" fullWidth={true} className={s.signInButton}>
          <Link href={ROUTES.login} className={s.link}>
            {t('auth.forgotPassword.backToSignIn')}
          </Link>
        </Button>
      </Card>
    </main>
  )
}
