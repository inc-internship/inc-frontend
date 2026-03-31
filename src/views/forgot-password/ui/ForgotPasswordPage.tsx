import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import { ForgotPasswordForm } from '@/features/forgot-password/ui/ForgotPasswordForm'
import s from './ForgotPasswordPage.module.scss'
import Link from 'next/link'
import { Button } from '@/shared/ui/Button'

export const ForgotPasswordPage = () => (
  <Card>
    <Typography variant="h1" align="center" className={s.title}>
      Forgot Password
    </Typography>
    <ForgotPasswordForm />
    <Button asChild={true} variant="default" className={s.signInButton}>
      <Link href="/sign-in" className={s.link}>
        Back to Sign In
      </Link>
    </Button>
  </Card>
)
