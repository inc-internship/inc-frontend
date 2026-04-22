'use client'

import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import { ForgotPasswordForm } from '@/features/forgot-password'
import s from './ForgotPasswordPage.module.scss'
import Link from 'next/link'
import { Button } from '@/shared/ui/Button'
import { ROUTES } from '@/shared/constants'
import { useI18n } from '@/shared/i18n'
import { Recaptcha } from '@/shared/ui/Recaptcha'
import { useState } from 'react'

export const ForgotPasswordPage = () => {
  const { t } = useI18n()
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  return (
    <main className={s.main}>
      <Card>
        <Typography variant="h1" align="center" className={s.title}>
          {t('auth.forgotPassword.title')}
        </Typography>
        <ForgotPasswordForm
          recaptchaToken={recaptchaToken}
          onResetRecaptcha={() => setRecaptchaToken(null)}
        />
        <Button asChild={true} variant="default" fullWidth={true} className={s.signInButton}>
          <Link href={ROUTES.login} className={s.link}>
            {t('auth.forgotPassword.backToSignIn')}
          </Link>
        </Button>
        <Recaptcha
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={setRecaptchaToken}
          theme="dark"
        />
      </Card>
    </main>
  )
}
