'use client'

import s from './ForgotPasswordForm.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ForgotPasswordFormField, forgotPasswordFormSchema } from '@/features/auth'
import { EmailSentModal } from '@/shared/ui/EmailSentModal'
import { Spinner } from '@/shared/ui/Spinner'
import { BASE_REDIRECT_URL, PASSWORD_RECOVERY_EMAIL_STORAGE_KEY, ROUTES } from '@/shared/constants'
import { usePasswordRecoveryMutation } from '@/entities/auth'

export const ForgotPasswordForm = () => {
  const [passwordRecovery, { isLoading }] = usePasswordRecoveryMutation()
  const [sentEmail, setSentEmail] = useState<string | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormField>({
    resolver: zodResolver(forgotPasswordFormSchema),
  })

  const submitHandler = async (data: ForgotPasswordFormField) => {
    try {
      await passwordRecovery({
        email: data.email,
        redirectUrl: `${BASE_REDIRECT_URL}/${ROUTES.recoveryPassword}`,
      }).unwrap()

      localStorage.setItem(PASSWORD_RECOVERY_EMAIL_STORAGE_KEY, data.email)
      setSentEmail(data.email)
      setIsSuccessModalOpen(true)
      reset()
    } catch {}
  }

  const disabled = isLoading || isSubmitting

  return (
    <>
      <form className={s.form} noValidate onSubmit={handleSubmit(submitHandler)}>
        <Input
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="Epam@epam.com"
          error={errors.email?.message}
          disabled={disabled}
          {...register('email')}
        />

        <Typography variant="text-m" className={s.assistText}>
          Enter your email and we will send you further instruction
        </Typography>

        <Button
          variant="primary"
          type="submit"
          fullWidth
          className={s.submitButton}
          disabled={disabled}
        >
          {isSubmitting ? <Spinner /> : 'Send Link'}
        </Button>
      </form>

      {sentEmail && (
        <EmailSentModal
          email={sentEmail}
          open={isSuccessModalOpen}
          onOpenChange={setIsSuccessModalOpen}
        />
      )}
    </>
  )
}
