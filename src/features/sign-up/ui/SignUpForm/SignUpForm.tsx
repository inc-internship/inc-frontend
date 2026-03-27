'use client'

import { Form, FormActions, FormFields, FormFooter } from '@/shared/ui/Form'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { Input } from '@/shared/ui/Input'
import { FormSocials } from '@/shared/ui/FormSocials'
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
    // await signUp(data).unwrap()
    reset()
  }

  return (
    <div className={s.formWrapper}>
      <Form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <Typography className={s.title} variant="h1">
          Sign Up
        </Typography>

        <div className={s.socials}>
          <FormSocials />
        </div>

        <FormFields className={s.formFields}>
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
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            type="password"
            label="Password confirmation"
            error={errors.passwordConfirm?.message}
            {...register('passwordConfirm')}
          />

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
        </FormFields>

        <FormActions className={s.actions}>
          {/*=======*/}
          <Button className={s.submitButton} variant="primary" type="submit">
            Sign Up
          </Button>
          {/*<Button className={s.submitButton} variant="primary" type="submit" disabled={isLoading}>*/}
          {/*  Sign Up*/}
          {/*</Button>*/}
        </FormActions>

        <FormFooter className={s.footer}>
          <Typography variant="text-l" className={s.footerInfo}>
            Do you have an account?
          </Typography>
          <Button variant="default" className={s.footerBtn} type="button" asChild={true}>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </FormFooter>
      </Form>
    </div>
  )
}
