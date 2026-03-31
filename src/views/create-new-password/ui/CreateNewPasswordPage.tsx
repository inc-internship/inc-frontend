'use client'

import s from './CreateNewPasswordPage.module.scss'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateNewPasswordFormField,
  createNewPasswordFormSchema,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@/features/auth'

export const CreateNewPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateNewPasswordFormField>({
    resolver: zodResolver(createNewPasswordFormSchema),
  })

  const submitHandler = () => {}

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
              disabled={isSubmitting}
              {...register('newPassword')}
            />
            <Input
              type="password"
              label="Password confirmation"
              placeholder="******************"
              autoComplete="new-password"
              error={errors.passwordConfirmation?.message}
              disabled={isSubmitting}
              {...register('passwordConfirmation')}
            />
          </div>

          <Typography variant="text-m" className={s.description}>
            {`Your password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`}
          </Typography>

          <div className={s.actions}>
            <Button variant="primary" type="submit" fullWidth={true} disabled={isSubmitting}>
              Create new password
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
