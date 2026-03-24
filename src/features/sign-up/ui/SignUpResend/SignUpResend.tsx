import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Image from 'next/image'
import { Input } from '@/shared/ui/Input'
import { Form } from '@/shared/ui/Form'
import s from './SignUpResend.module.scss'

export const SignUpResend = () => {
  return (
    <div className={s.resendWrapper}>
      <Typography variant="h1">Email verification link expired</Typography>
      <p className={s.resendSubTitle}>
        Looks like the verification link has expired. Not to worry, we can send the link again
      </p>
      <div className={s.resendFormWrapper}>
        <Form className={s.resendForm}>
          <Input
            className={s.inputField}
            name="email"
            type="email"
            label="Email"
            placeholder="Epam@epam.com"
          />
          <Button className={s.resendBtn} type={'submit'} variant={'primary'}>
            Resend verification link
          </Button>
        </Form>
      </div>
      <Image src="/images/auth/auth-boy.svg" alt="Email Resend" width={473} height={353} />
    </div>
  )
}
