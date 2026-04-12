'use client'

import React from 'react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import s from './LoginForm.module.scss'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormField, loginFormSchema } from '@/features/auth'
import { useLazyGetMeQuery, useLoginMutation } from '@/entities/auth'
import { Typography } from '@/shared/ui/Typography'
import { Spinner } from '@/shared/ui/Spinner'
import { getApiErrorMessage, isClientError } from '@/shared/api'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/shared/store'
import { setInitialized, setUser } from '@/entities/user/user.slice'
import { ROUTES } from '@/shared/constants'

export const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation()
  const [getMe] = useLazyGetMeQuery()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormField>({ resolver: zodResolver(loginFormSchema), mode: 'onChange' })

  const serverErrorMessage = errors.root?.server?.message
  const hasServerError = !!serverErrorMessage

  const clearServerError = () => {
    if (errors.root?.server) {
      clearErrors('root.server')
    }
  }

  const submitHandler = async (data: LoginFormField) => {
    try {
      const res = await login(data).unwrap()

      localStorage.setItem('accessToken', res.accessToken)
      dispatch(setInitialized(false))

      try {
        const me = await getMe().unwrap()
        dispatch(setUser(me))
      } catch {
        // AuthInitializer restores the user state after navigation if this request fails.
      }

      reset()
      router.replace(ROUTES.main)
    } catch (error) {
      if (isClientError(error)) {
        setError('root.server', {
          type: 'server',
          message: getApiErrorMessage(error),
        })
      }
    }
  }

  const disabled = isLoading || isSubmitting
  const disabledButton = disabled || !isValid

  return (
    <form noValidate={true} onSubmit={handleSubmit(submitHandler)}>
      <div className={s.formFields}>
        <Input
          type="email"
          autoComplete="username"
          label="Email"
          placeholder="Epam@epam.com"
          variant={errors.email || hasServerError ? 'error' : 'default'}
          error={errors.email?.message}
          {...register('email', { onChange: clearServerError })}
          disabled={disabled}
        />
        <Input
          type="password"
          autoComplete="current-password"
          label="Password"
          placeholder="**********"
          variant={errors.password || hasServerError ? 'error' : 'default'}
          error={errors.password?.message ?? serverErrorMessage}
          {...register('password', { onChange: clearServerError })}
          disabled={disabled}
        />
      </div>

      <Typography variant="link-m" href={ROUTES.forgotPassword} className={s.forgotPassword}>
        Forgot password
      </Typography>

      <Button
        className={s.submitButton}
        variant="primary"
        type="submit"
        fullWidth={true}
        disabled={disabledButton}
      >
        {isSubmitting ? <Spinner /> : 'Sign In'}
      </Button>
    </form>
  )
}
