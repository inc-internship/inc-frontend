import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { Input } from '@/shared/ui/Input'
import { CheckBox } from '@/shared/ui/CheckBox'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import s from './SignUpForm.module.scss'
import { SignUpRequestDto, signUpRequestSchema } from '@/entities/session/api/contracts'
// import { useSignUpMutation } from '@/entities/session/api/sessionApi'

export const SignUpForm = () => {
  // const [signUp, { isLoading }] = useSignUpMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SignUpRequestDto>({
    resolver: zodResolver(signUpRequestSchema),
  })

  const onSubmit = async (data: SignUpRequestDto) => {
    console.log(data)
    // await signUp(data).unwrap()
    reset()
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
            <CheckBox id="terms" checked={field.value} onCheckedChange={field.onChange} />
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
