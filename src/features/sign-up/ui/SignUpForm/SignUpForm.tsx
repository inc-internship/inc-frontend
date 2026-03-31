import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { Input } from '@/shared/ui/Input'
import { CheckBox } from '@/shared/ui/CheckBox'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import s from './SignUpForm.module.scss'
import { SignUpRequestDto, signUpRequestSchema } from '@/entities/session/api/contracts'
import { useSignUpMutation } from '@/entities/auth/api/auth.api'

export const SignUpForm = () => {
  const [signUp, { isLoading }] = useSignUpMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpRequestDto>({
    resolver: zodResolver(signUpRequestSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  // const disabled = isLoading || isSubmitting || !isValid

  const onSubmit = async (data: SignUpRequestDto) => {
    try {
      const result = await signUp({
        login: data.userName,
        email: data.email,
        password: data.password,
        redirectUrl: 'https://minglo.blog/example-path',
        // redirectUrl: `${BASE_URL}/login`,
        // redirectUrl: 'https://www.onliner.by/',
      })

      console.log('RESULT:', result)

      reset()
    } catch (e) {
      console.log('ERROR:', e)
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
        />
        <Input
          type="email"
          label="Email"
          placeholder="Epam@epam.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          type="password"
          label="Password"
          placeholder="******************"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          type="password"
          label="Password confirmation"
          placeholder="******************"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
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
      <Button className={s.submitButton} variant="primary" type="submit">
        Sign Up
      </Button>
    </form>
  )
}
