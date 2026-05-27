'use client'

import s from './ForgotPasswordForm.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ForgotPasswordFormField, buildForgotPasswordFormSchema } from '@/features/auth'
import { usePasswordRecoveryMutation } from '@/entities/auth/api/auth.api'
import { EmailSentModal } from '@/shared/ui/EmailSentModal'
import { Spinner } from '@/shared/ui/Spinner'
import { getApiErrorMessage, isClientError } from '@/shared/api'
import {
  BASE_URL,
  PASSWORD_RECOVERY_EMAIL_STORAGE_KEY,
  ROUTES,
  getLocalizedRoute,
} from '@/shared/constants'
import { useI18n } from '@/shared/i18n'

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

type ForgotPasswordFormProps = {
  recaptchaToken: string | null
  onResetRecaptcha: () => void
}

export const ForgotPasswordForm = ({
  recaptchaToken,
  onResetRecaptcha,
}: ForgotPasswordFormProps) => {
  const { locale, t } = useI18n()
  const schema = useMemo(() => buildForgotPasswordFormSchema(t), [t])
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
    resolver: zodResolver(schema),
  })

  const serverErrorMessage = errors.root?.server?.message

  const clearServerError = () => {
    if (errors.root?.server) {
      clearErrors('root.server')
    }
  }

  const submitHandler = async (data: ForgotPasswordFormField) => {
    if (!recaptchaToken) {
      setError('root.server', {
        type: 'server',
        message: t('auth.forgotPassword.recaptchaRequired'),
      })
      return
    }

    try {
      await passwordRecovery({
        email: data.email,
        redirectUrl: `${BASE_URL}${getLocalizedRoute(locale, ROUTES.recoveryPassword)}`,
        captchaValue: recaptchaToken,
      }).unwrap()

      localStorage.setItem(PASSWORD_RECOVERY_EMAIL_STORAGE_KEY, data.email)
      setSentEmail(data.email)
      setIsSuccessModalOpen(true)
      reset()
      onResetRecaptcha()
    } catch (error) {
      onResetRecaptcha()
      if (isClientError(error)) {
        const apiError = error as { data?: PasswordRecoveryErrorResponse }
        const data = apiError.data
        const emailMessage =
          getEmailErrorFromList(data?.extensions) ||
          getEmailErrorFromList(data?.messages) ||
          getEmailErrorFromList(data?.errorsMessages) ||
          (Array.isArray(data?.message) ? getEmailErrorFromList(data.message) : undefined)
        const fallbackMessage = getApiErrorMessage(error, t('common.somethingWentWrong'))

        setError('root.server', {
          type: 'server',
          message:
            emailMessage ||
            (fallbackMessage === 'Validation failed'
              ? t('auth.forgotPassword.userNotFound')
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
          label={t('common.email')}
          autoComplete="email"
          placeholder="Epam@epam.com"
          error={errors.email?.message ?? serverErrorMessage}
          disabled={disabled}
          {...register('email', { onChange: clearServerError })}
        />

        <Typography variant="text-m" className={s.assistText}>
          {t('auth.forgotPassword.instructions')}
        </Typography>

        <Button
          variant="primary"
          type="submit"
          fullWidth
          className={s.submitButton}
          disabled={disabled || !recaptchaToken}
        >
          {isSubmitting ? <Spinner /> : t('auth.forgotPassword.sendLink')}
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
