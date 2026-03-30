'use client'

import AuthBoy from 'public/images/auth/auth-boy.svg'
import Image from 'next/image'
import s from './RecoveryPasswordPage.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'

export const RecoveryPasswordPage = () => (
  <div className={s.wrapper}>
    <div className={s.container}>
      <Typography variant="h1" className={s.title}>
        Email verification link expired
      </Typography>
      <Typography variant="text-l" className={s.description}>
        Looks like the verification link has expired. Not to worry, we can send the link again
      </Typography>
      <Button variant="primary" className={s.button}>
        Resend link
      </Button>
    </div>
    <Image src={AuthBoy} alt="AuthBoy" />
  </div>
)
