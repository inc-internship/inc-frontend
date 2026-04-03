import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import s from './VerificationLinkExpiredForm.module.scss'
import { useResendConfirmationMutation } from '@/entities/auth/api/auth.api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BASE_URL } from '@/shared/constants'
import { ApiErrorResponse, ErrorExtension } from '@/entities/auth/api/auth.types'
import { ResendConfirmation } from '@/features/auth/model/types'
import { resendConfirmationSchema } from '@/features/auth/model/resend-confirmation-form-shcema'

export const VerificationLinkExpiredForm = () => {
  const [resendConfirmation, { isLoading }] = useResendConfirmationMutation()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResendConfirmation>({
    resolver: zodResolver(resendConfirmationSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const disabled = isLoading || isSubmitting || !isValid
  const formDisabled = isLoading || isSubmitting

  const onSubmit = async (data: ResendConfirmation) => {
    try {
      clearErrors('email')

      await resendConfirmation({
        email: data.email,
        redirectUrl: `${BASE_URL}/email-confirmed`,
      }).unwrap()

      reset()
    } catch (error) {
      const apiError = error as { status: number; data: ApiErrorResponse | string; error: string }
      let errorMessage = 'Failed to resend email. Please try again.'
      let extensions: ErrorExtension[] | undefined

      if (typeof apiError?.data === 'string') {
        errorMessage = apiError.data
      } else if (apiError?.data) {
        errorMessage = apiError.data.message || errorMessage
        extensions = apiError.data.extensions
      }

      console.error('Resend confirmation error:', {
        status: apiError?.status,
        message: errorMessage,
        extensions,
      })

      if (apiError?.status === 400) {
        if (extensions && extensions.length > 0) {
          extensions.forEach(ext => {
            if (ext.field === 'email') {
              setError('email', { message: ext.message })
            }
          })
        } else {
          setError('email', { message: errorMessage })
        }
      } else if (apiError?.status === 429) {
        setError('email', { message: 'Too many attempts. Please try again later.' })
      } else {
        setError('email', { message: errorMessage })
      }
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
      <Button disabled={disabled} type="submit" variant="primary">
        Resend verification link
      </Button>
    </form>
  )
}
