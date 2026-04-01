import { Card } from '@/shared/ui/Card'
import { Typography } from '@/shared/ui/Typography'
import { FormSocials } from '@/shared/ui/FormSocials'
import { SignUpForm } from '@/features/sign-up'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import s from './SignUpPage.module.scss'
import { useState } from 'react'
import { EmailSentModal } from '@/features/auth/ui/email-sent-modal/EmailSentModal'

export const SignUpPage = () => {
  const [openModal, setOpenModal] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <>
      <main className={s.main}>
        <Card className={s.card}>
          <Typography className={s.title} variant="h1" align="center">
            Sign Up
          </Typography>
          <FormSocials />
          <SignUpForm
            onSuccess={(email: string) => {
              setEmail(email)
              setOpenModal(true)
            }}
          />
          <Typography variant="text-l" className={s.footerInfo}>
            Do you have an account?
          </Typography>
          <Button variant="default" className={s.footerBtn} type="button" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </Card>
      </main>
      <EmailSentModal open={openModal} onOpenChange={setOpenModal} email={email} />
    </>
  )
}
