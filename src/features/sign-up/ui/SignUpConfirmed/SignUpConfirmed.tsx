import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import s from './SignUpConfirmed.module.scss'

/** Shows success state after email confirmation. */
export const SignUpConfirmed = () => {
  return (
    <div className={s.confirmedWrapper}>
      <Typography className={s.title} variant="h1">
        Congratulations!
      </Typography>
      <Typography className={s.confirmedSubTitle} variant="text-l">
        Your email has been confirmed
      </Typography>
      <div className={s.confirmedBtnWrap}>
        <Button className={s.confirmedBtn} type="button" variant="primary" asChild={true}>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
      <Image src="/images/auth/auth-girl.svg" alt="Email confirmed" width={432} height={300} />
    </div>
  )
}
