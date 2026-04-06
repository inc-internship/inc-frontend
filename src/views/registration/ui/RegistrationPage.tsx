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

export const RegistrationPage = () => {
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
          <RegistrationForm
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
