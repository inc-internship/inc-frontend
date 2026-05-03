'use client'

import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import { FormSocials } from '@/shared/ui/FormSocials'
import { RegistrationForm } from '@/features/registration'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import s from './RegistrationPage.module.scss'
import { useState } from 'react'
import { EmailSentModal } from '@/features/auth'
import { ROUTES, getLocalizedRoute } from '@/shared/constants'
import { useI18n } from '@/shared/i18n'

export const RegistrationPage = () => {
  const { locale, t } = useI18n()
  const [openModal, setOpenModal] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <>
      <main className={s.main}>
        <Card className={s.card}>
          <Typography className={s.title} variant="h1" align="center">
            {t('auth.registration.title')}
          </Typography>
          <FormSocials />
          <RegistrationForm
            onSuccess={(email: string) => {
              setEmail(email)
              setOpenModal(true)
            }}
          />
          <Typography variant="text-l" className={s.footerInfo}>
            {t('auth.registration.haveAccount')}
          </Typography>
          <Button variant="default" className={s.footerBtn} type="button" asChild>
            <Link href={getLocalizedRoute(locale, ROUTES.login)}>{t('auth.login.submit')}</Link>
          </Button>
        </Card>
      </main>
      <EmailSentModal open={openModal} onOpenChange={setOpenModal} email={email} />
    </>
  )
}
