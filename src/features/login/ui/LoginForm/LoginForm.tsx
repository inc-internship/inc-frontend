'use client'

import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import s from './LoginForm.module.scss'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormField, loginFormSchema } from '@/features/auth'
import { useLoginMutation } from '@/entities/auth/api/auth.api'
import { Typography } from '@/shared/ui/Typography'
import React from 'react'
import { Spinner } from '@/shared/ui/Spinner'
import { getApiErrorMessage, isClientError } from '@/shared/api'

export const LoginForm = () => {
  const [signIn, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormField>({ resolver: zodResolver(loginFormSchema) })

  const submitHandler = async (data: LoginFormField) => {
    try {
      await signIn(data).unwrap()
      reset()
    } catch (error) {
      if (isClientError(error)) {
        setError('password', {
          type: 'client',
          message: getApiErrorMessage(error),
        })
        setError('email', {
          type: 'client',
          message: ' ',
        })
      }
    }
  }

  const disabled = isLoading || isSubmitting

  return (
    <form noValidate={true} onSubmit={handleSubmit(submitHandler)}>
      <div className={s.formFields}>
        <Input
          type="email"
          autoComplete="username"
          label="Email"
          placeholder="Epam@epam.com"
          error={errors.email?.message}
          {...register('email')}
          disabled={disabled}
        />
        <Input
          type="password"
          autoComplete="current-password"
          label="Password"
          placeholder="**********"
          error={errors.password?.message}
          {...register('password')}
          disabled={disabled}
        />
      </div>

      <Typography variant="link-m" href="/forgot-password" className={s.forgotPassword}>
        Forgot password
      </Typography>

      <Button
        className={s.submitButton}
        variant="primary"
        type="submit"
        fullWidth={true}
        disabled={disabled}
      >
        {isSubmitting ? <Spinner /> : 'Sign In'}
      </Button>
    </form>
  )
}
