import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import s from './VerificationLinkExpiredForm.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import { BASE_URL, ROUTES, getLocalizedRoute } from '@/shared/constants'
import { ApiErrorResponse } from '@/entities/auth/api/auth.types'
import { ResendConfirmation } from '@/features/auth/model/types'
import { useForm } from 'react-hook-form'
import { Spinner } from '@/shared/ui/Spinner'
import { buildResendConfirmationSchema } from '@/features/auth'
import { useResendConfirmationMutation } from '@/entities/auth'
import { useI18n } from '@/shared/i18n'
import { useMemo } from 'react'

export const VerificationLinkExpiredForm = () => {
  const { locale, t } = useI18n()
  const schema = useMemo(() => buildResendConfirmationSchema(t), [t])
  const [resendConfirmation, { isLoading }] = useResendConfirmationMutation()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResendConfirmation>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const disabled = !isValid || isLoading
  const formDisabled = isLoading || isSubmitting

  const onSubmit = async (data: ResendConfirmation) => {
    try {
      await resendConfirmation({
        email: data.email,
        redirectUrl: `${BASE_URL}${getLocalizedRoute(locale, ROUTES.emailConfirmed)}`,
      }).unwrap()

      reset()
    } catch (error) {
      const apiError = error as {
        status?: number
        data?: ApiErrorResponse
      }

      const extensions = apiError?.data?.extensions

      const emailError = extensions?.find(ext => ext.field === 'email')

      if (emailError) {
        setError('email', {
          type: 'server',
          message: emailError.message,
        })
        return
      }

      if (apiError?.status === 429) {
        setError('email', {
          message: t('auth.verificationExpired.tooManyAttempts'),
        })
        return
      }

      setError('email', {
        message: apiError?.data?.message || t('auth.verificationExpired.emailInvalid'),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.formInner}>
      <Input
        type="email"
        label={t('common.email')}
        placeholder="Epam@epam.com"
        error={errors.email?.message}
        {...register('email')}
        disabled={formDisabled}
      />
      <Button
        className={s.submitButton}
        disabled={disabled}
        type="submit"
        variant="primary"
        fullWidth
      >
        {isSubmitting ? <Spinner /> : t('auth.verificationExpired.resendLink')}
      </Button>
    </form>
  )
}
