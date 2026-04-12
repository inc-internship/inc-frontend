'use client'

import s from './ForgotPasswordForm.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ForgotPasswordFormField, forgotPasswordFormSchema } from '@/features/auth'
import { usePasswordRecoveryMutation } from '@/entities/auth/api/auth.api'
import { EmailSentModal } from '@/shared/ui/EmailSentModal'
import { Spinner } from '@/shared/ui/Spinner'
import { getApiErrorMessage, isClientError } from '@/shared/api'
import { BASE_REDIRECT_URL, PASSWORD_RECOVERY_EMAIL_STORAGE_KEY, ROUTES } from '@/shared/constants'

type ApiFieldError = {
  field?: string
  message?: string
}

type PasswordRecoveryErrorResponse = {
  message?: string | ApiFieldError[]
  error?: string
  extensions?: ApiFieldError[]
  messages?: ApiFieldError[]
  errorsMessages?: ApiFieldError[]
}

const getEmailErrorFromList = (errors?: ApiFieldError[]) => {
  return errors?.find(error => error.field === 'email')?.message
}

export const ForgotPasswordForm = () => {
  const [passwordRecovery, { isLoading }] = usePasswordRecoveryMutation()
  const [sentEmail, setSentEmail] = useState<string | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormField>({
    resolver: zodResolver(forgotPasswordFormSchema),
  })

  const serverErrorMessage = errors.root?.server?.message

  const clearServerError = () => {
    if (errors.root?.server) {
      clearErrors('root.server')
    }
  }

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
    } catch (error) {
      if (isClientError(error)) {
        const apiError = error as { data?: PasswordRecoveryErrorResponse }
        const data = apiError.data
        const emailMessage =
          getEmailErrorFromList(data?.extensions) ||
          getEmailErrorFromList(data?.messages) ||
          getEmailErrorFromList(data?.errorsMessages) ||
          (Array.isArray(data?.message) ? getEmailErrorFromList(data.message) : undefined)
        const fallbackMessage = getApiErrorMessage(error)

        setError('root.server', {
          type: 'server',
          message:
            emailMessage ||
            (fallbackMessage === 'Validation failed'
              ? "User with this email doesn't exist"
              : fallbackMessage),
        })
      }
    }
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
          error={errors.email?.message ?? serverErrorMessage}
          disabled={disabled}
          {...register('email', { onChange: clearServerError })}
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
