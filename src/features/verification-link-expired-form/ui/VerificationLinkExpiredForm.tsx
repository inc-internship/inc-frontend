import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import s from './VerificationLinkExpiredForm.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import { BASE_REDIRECT_URL, ROUTES } from '@/shared/constants'
import { ApiErrorResponse } from '@/entities/auth/api/auth.types'
import { ResendConfirmation } from '@/features/auth/model/types'
import { useForm } from 'react-hook-form'
import { Spinner } from '@/shared/ui/Spinner'
import { resendConfirmationSchema } from '@/features/auth'
import { useResendConfirmationMutation } from '@/entities/auth'

export const VerificationLinkExpiredForm = () => {
  const [resendConfirmation, { isLoading }] = useResendConfirmationMutation()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResendConfirmation>({
    resolver: zodResolver(resendConfirmationSchema),
    mode: 'onChange',
  })

  const disabled = !isValid || isLoading
  const formDisabled = isLoading || isSubmitting

  const onSubmit = async (data: ResendConfirmation) => {
    try {
      await resendConfirmation({
        email: data.email,
        redirectUrl: `${BASE_REDIRECT_URL}${ROUTES.emailConfirmed}`,
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
          message: 'Too many attempts. Try again later.',
        })
        return
      }

      setError('email', {
        message: apiError?.data?.message || 'Email is invalid or cannot be used',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.formInner}>
      <Input
        type="email"
        label="Email"
        placeholder="Epam@epam.com"
        error={errors.email?.message}
        {...register('email')}
        disabled={formDisabled}
      />
      <Button disabled={disabled} type="submit" variant="primary" fullWidth>
        {isSubmitting ? <Spinner /> : 'Resend verification link'}
      </Button>
    </form>
  )
}
