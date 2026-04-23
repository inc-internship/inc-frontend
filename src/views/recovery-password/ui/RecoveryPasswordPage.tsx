'use client'

import AuthBoy from 'public/images/auth/auth-boy.svg'
import Image from 'next/image'
import s from './RecoveryPasswordPage.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/shared/constants'
import { useI18n } from '@/shared/i18n'

export const RecoveryPasswordPage = () => {
  const router = useRouter()
  const { t } = useI18n()

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" className={s.title}>
          {t('auth.recoveryExpired.title')}
        </Typography>
        <Typography variant="text-l" className={s.description}>
          {t('auth.recoveryExpired.description')}
        </Typography>
        <Button
          variant="primary"
          className={s.button}
          onClick={() => router.replace(ROUTES.forgotPassword)}
        >
          {t('auth.recoveryExpired.resendLink')}
        </Button>
      </div>
      <Image src={AuthBoy} alt={t('auth.recoveryExpired.title')} className={s.image} />
    </div>
  )
}
