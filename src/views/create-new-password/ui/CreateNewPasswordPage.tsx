'use client'

import s from './CreateNewPasswordPage.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  CreateNewPasswordFormField,
  createNewPasswordFormSchema,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@/features/auth'
import { useNewPasswordMutation } from '@/entities/auth/api/auth.api'
import { Spinner } from '@/shared/ui/Spinner'

export const CreateNewPasswordPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [createNewPassword, { isLoading }] = useNewPasswordMutation()
  const recoveryCode = searchParams.get('code')

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

    if (!recoveryCode) {
      router.replace('/recovery-password')

      return
    }

    try {
      await createNewPassword({ newPassword, recoveryCode }).unwrap()
      router.replace('/login')
    } catch {
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
