'use client'

import { StatusWidget } from '@/widgets/status-widget'
import { Button } from '@/shared/ui/Button'
import { ROUTES } from '@/shared/constants'
import authGirlImage from '../../../../public/images/auth/auth-girl.svg'
import s from './EmailConfirmedPage.module.scss'

export const EmailConfirmedPage = () => (
  <StatusWidget
    text="Your email has been confirmed"
    title="Congratulations!"
    imageSrc={authGirlImage}
    imageAlt="Your email has been confirmed"
    childrenClassName={s.confirmedChildren}
    imageWrapperClassName={s.confirmedImageWrapper}
  >
    <Button asChild variant="primary" className={s.button}>
      <a href={ROUTES.login}>Sign In</a>
    </Button>
  </StatusWidget>
)
