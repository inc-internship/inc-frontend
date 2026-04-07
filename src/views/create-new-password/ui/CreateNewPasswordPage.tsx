'use client'

import s from './CreateNewPasswordPage.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import {
  CreateNewPasswordFormField,
  createNewPasswordFormSchema,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@/features/auth'
import { useNewPasswordMutation } from '@/entities/auth/api/auth.api'
import { Spinner } from '@/shared/ui/Spinner'
import { ApiErrorResponse } from '@/entities/auth/api/auth.types'
import { PASSWORD_RECOVERY_EMAIL_STORAGE_KEY } from '@/shared/constants'

type CreateNewPasswordPageProps = {
  recoveryCode: string
}

export const CreateNewPasswordPage = ({ recoveryCode }: CreateNewPasswordPageProps) => {
  const router = useRouter()
  const [createNewPassword, { isLoading }] = useNewPasswordMutation()

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateNewPasswordFormField>({
    resolver: zodResolver(createNewPasswordFormSchema),
  })

  const submitHandler = async ({ newPassword }: CreateNewPasswordFormField) => {
    clearErrors('root')

    try {
      await createNewPassword({ newPassword, recoveryCode }).unwrap()
      localStorage.removeItem(PASSWORD_RECOVERY_EMAIL_STORAGE_KEY)
      router.replace('/login')
    } catch (error) {
      const apiError = error as {
        status?: number
        data?: ApiErrorResponse
      }
      const recoveryCodeError = apiError.data?.extensions?.find(ext => ext.field === 'recoveryCode')
      const errorMessage = apiError.data?.message.toLowerCase() ?? ''
      const isExpiredOrInvalidCode =
        apiError.status === 400 ||
        Boolean(recoveryCodeError) ||
        errorMessage.includes('recovery code') ||
        errorMessage.includes('expired')

      if (isExpiredOrInvalidCode) {
        router.replace('/recovery-password')

        return
      }

      setError('root', { type: 'server', message: 'Не удалось изменить пароль' })
    }
  }

  const disabled = isSubmitting || isLoading

  return (
    <section className={s.section}>
      <div className={s.card}>
        <form className={s.form} noValidate={true} onSubmit={handleSubmit(submitHandler)}>
          <Typography variant="h1" className={s.title}>
            Create New Password
          </Typography>

          <div className={s.fields}>
            <Input
              type="password"
              label="New password"
              placeholder="******************"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              disabled={disabled}
              {...register('newPassword')}
            />
            <Input
              type="password"
              label="Password confirmation"
              placeholder="******************"
              autoComplete="new-password"
              error={errors.passwordConfirmation?.message}
              disabled={disabled}
              {...register('passwordConfirmation')}
            />
          </div>

          <Typography variant="text-m" className={s.description}>
            {`Your password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`}
          </Typography>

          <div className={s.actions}>
            {errors.root?.message && (
              <Typography variant="text-m" className={s.submitError} role="alert">
                {errors.root.message}
              </Typography>
            )}

            <Button variant="primary" type="submit" fullWidth={true} disabled={disabled}>
              {isSubmitting ? <Spinner /> : 'Create new password'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
