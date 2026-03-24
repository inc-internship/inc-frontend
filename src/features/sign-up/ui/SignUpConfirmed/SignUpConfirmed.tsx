import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import s from './SignUpConfirmed.module.scss'

export const SignUpConfirmed = () => {
  return (
    <div className={s.confirmedWrapper}>
      <Typography className={s.title} variant="h1">
        Congratulations!
      </Typography>
      <p className={s.confirmedSubTitle}>Your email has been confirmed</p>
      <Button className={s.confirmedBtn} type={'button'} variant={'primary'} asChild={true}>
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <Image src="/images/auth/auth-girl.svg" alt="Email confirmed" width={432} height={300} />
    </div>
  )
}
