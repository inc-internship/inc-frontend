'use client'

import { LoginForm } from '@/features/login'
import { FormSocials } from '@/shared/ui/FormSocials'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { Typography } from '@/shared/ui/Typography'
import { Card } from '@/shared/ui/Card'
import { ROUTES } from '@/shared/constants'
import { useI18n } from '@/shared/i18n'
import s from './LoginPage.module.scss'

export const LoginPage = () => {
  const { t } = useI18n()

  return (
    <main className={s.main}>
      <Card className={s.loginCard}>
        <Typography variant="h1" align="center" className={s.title}>
          {t('auth.login.title')}
        </Typography>
        <FormSocials />
        <LoginForm />
        <Typography variant="text-l" align="center">
          {t('auth.login.noAccount')}
        </Typography>
        <Button asChild={true} fullWidth={true}>
          <Link href={ROUTES.register}>{t('header.signUp')}</Link>
        </Button>
      </Card>
    </main>
  )
}
