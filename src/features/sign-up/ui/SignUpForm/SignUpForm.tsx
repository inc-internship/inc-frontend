import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { Input } from '@/shared/ui/Input'
import { CheckBox } from '@/shared/ui/CheckBox'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import s from './SignUpForm.module.scss'
import { SignUpRequestDto } from '@/features/auth'
import { useSignUpMutation } from '@/entities/auth/api/auth.api'
import { signUpRequestSchema } from '@/features/auth/model/sign-up-form-shcema'
import { BASE_URL } from '@/shared/constants'
import { ApiErrorResponse } from '@/entities/auth/api/auth.types'

type SignUpFormProps = {
  onSuccess: (email: string) => void
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [signUp, { isLoading }] = useSignUpMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpRequestDto>({
    resolver: zodResolver(signUpRequestSchema),
    mode: 'onChange',
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      terms: false,
    },
    reValidateMode: 'onChange',
  })

  const disabled = isLoading || isSubmitting || !isValid
  const formDisabled = isLoading || isSubmitting

  const onSubmit = async (data: SignUpRequestDto) => {
    try {
      await signUp({
        login: data.userName,
        email: data.email,
        password: data.password,
        redirectUrl: `${BASE_URL}/email-confirmed`,
      }).unwrap()

      onSuccess(data.email)
      reset()
    } catch (error) {
      const apiError = error as {
        status: number
        data?: ApiErrorResponse
      }

      const extensions = apiError?.data?.extensions

      const fieldMap: Record<string, keyof SignUpRequestDto> = {
        login: 'userName',
        email: 'email',
      }

      if (extensions?.length) {
        extensions.forEach(ext => {
          const field = fieldMap[ext.field]

          if (field) {
            setError(field, {
              type: 'server',
              message: ext.message,
            })
          }
        })
      }
    }
  }

  return (
    <form className={s.formWrapper} onSubmit={handleSubmit(onSubmit)}>
      <div className={s.formFields}>
        <Input
          label="UserName"
          placeholder="Epam11"
          error={errors.userName?.message}
          {...register('userName')}
          disabled={formDisabled}
        />
        <Input
          type="email"
          label="Email"
          placeholder="Epam@epam.com"
          error={errors.email?.message}
          {...register('email')}
          disabled={formDisabled}
        />
        <Input
          type="password"
          label="Password"
          placeholder="******************"
          error={errors.password?.message}
          {...register('password')}
          disabled={formDisabled}
        />
        <Input
          type="password"
          label="Password confirmation"
          placeholder="******************"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
          disabled={formDisabled}
        />
      </div>
      <div className={s.checkboxRow}>
        <Controller
          name="terms"
          control={control}
          render={({ field }) => (
            <CheckBox
              id="terms"
              checked={field.value}
              onCheckedChange={value => field.onChange(value === true)}
              disabled={formDisabled}
            />
          )}
        />
        <Typography variant="text-s" as="label" htmlFor="terms" className={s.checkboxLabel}>
          I agree to the{' '}
          <Link className={s.checkBoxLink} href="/terms-of-service">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link className={s.checkBoxLink} href="/privacy-policy">
            Privacy Policy
          </Link>
        </Typography>
      </div>
      <Button disabled={disabled} className={s.submitButton} variant="primary" type="submit">
        Sign Up
      </Button>
    </form>
  )
}
