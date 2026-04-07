'use client'

import AuthBoy from 'public/images/auth/auth-boy.svg'
import Image from 'next/image'
import s from './RecoveryPasswordPage.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { VerificationLinkExpiredForm } from '@/features/verification-link-expired-form'

export const RecoveryPasswordPage = () => (
  <div className={s.wrapper}>
    <div className={s.container}>
      <Typography variant="h1" className={s.title}>
        Password recovery link expired
      </Typography>
      <Typography variant="text-l" className={s.description}>
        Looks like the recovery link has expired. Not to worry, we can send the link again
      </Typography>
      <VerificationLinkExpiredForm isWithInput={false} />
    </div>
    <Image src={AuthBoy} alt="AuthBoy" />
  </div>
)
