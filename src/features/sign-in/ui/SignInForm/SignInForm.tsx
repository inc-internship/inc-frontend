'use client'

import { Form, FormActions, FormAssist, FormFields, FormFooter } from '@/shared/ui/Form'
import { FormSocials } from '@/shared/ui/FormSocials'
import { Typography } from '@/shared/ui/Typography'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import s from './SignInForm.module.scss'
import { SignInRequestDto, signInRequestSchema, useSignInMutation } from '@/entities/session'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const SignInForm = () => {
  const [signIn, { isLoading }] = useSignInMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInRequestDto>({ resolver: zodResolver(signInRequestSchema) })

  const submitHandler = async (data: SignInRequestDto) => {
    await signIn(data).unwrap()
    reset()
  }

  return (
    <section className={s.section}>
      <div className={s.card}>
        <Form className={s.form} onSubmit={handleSubmit(submitHandler)}>
          <Typography className={s.title} variant="h1">
            Sign In
          </Typography>
          <div className={s.socials}>
            <FormSocials />
          </div>

          <FormFields className={s.fields}>
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
              placeholder="**********"
              error={errors.password?.message}
              {...register('password')}
            />
          </FormFields>
          <FormAssist align="right" className={s.assist}>
            <Typography as={Link} variant="link-m" href="/forgot-password">
              Forgot Password
            </Typography>
          </FormAssist>
          <FormActions className={s.actions}>
            <Button className={s.submitButton} variant="primary" type="submit" disabled={isLoading}>
              Sign In
            </Button>
          </FormActions>
          <FormFooter className={s.footer}>
            <Typography className={s.footerText} variant="text-l">
              Don&apos;t have an account?
            </Typography>
            <Button className={s.signUpButton} asChild={true}>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </FormFooter>
        </Form>
      </div>
    </section>
  )
}
