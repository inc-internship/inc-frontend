import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { Input } from '@/shared/ui/Input'
import { CheckBox } from '@/shared/ui/CheckBox'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import s from './RegistrationForm.module.scss'
import { RegistrationFormField } from '@/features/auth'
import { BASE_REDIRECT_URL, ROUTES } from '@/shared/constants'
import { ApiErrorResponse } from '@/entities/auth/api/auth.types'
import { Spinner } from '@/shared/ui/Spinner'
import { buildRegistrationFormSchema } from '@/features/auth'
import { useRegisterMutation } from '@/entities/auth'
import { useEffect, useMemo } from 'react'
import { useI18n } from '@/shared/i18n'

type Props = {
  onSuccess: (email: string) => void
}

export const RegistrationForm = ({ onSuccess }: Props) => {
  const { t } = useI18n()
  const schema = useMemo(() => buildRegistrationFormSchema(t), [t])
  const [registerUser, { isLoading }] = useRegisterMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    trigger,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm<RegistrationFormField>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const password = useWatch({ control, name: 'password' })
  const passwordConfirm = useWatch({ control, name: 'passwordConfirm' })

  useEffect(() => {
    if (!touchedFields.passwordConfirm && !passwordConfirm) return
    void trigger('passwordConfirm')
  }, [password, passwordConfirm, touchedFields.passwordConfirm, trigger])

  const disabled = isLoading || isSubmitting || !isValid
  const formDisabled = isLoading || isSubmitting

  const onSubmit = async (data: RegistrationFormField) => {
    try {
      await registerUser({
        login: data.userName,
        email: data.email,
        password: data.password,
        redirectUrl: `${BASE_REDIRECT_URL}${ROUTES.emailConfirmed}`,
      }).unwrap()

      onSuccess(data.email)
      reset()
    } catch (error) {
      const apiError = error as {
        status: number
        data?: ApiErrorResponse
      }

      const extensions = apiError?.data?.extensions

      const fieldMap: Record<string, keyof RegistrationFormField> = {
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
          label={t('auth.registration.userName')}
          placeholder="Epam11"
          error={errors.userName?.message}
          {...register('userName')}
          disabled={formDisabled}
        />
        <Input
          type="email"
          label={t('common.email')}
          placeholder="Epam@epam.com"
          error={errors.email?.message}
          {...register('email')}
          disabled={formDisabled}
        />
        <Input
          type="password"
          label={t('common.password')}
          placeholder="******************"
          error={errors.password?.message}
          {...register('password')}
          disabled={formDisabled}
        />
        <Input
          type="password"
          label={t('common.passwordConfirmation')}
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
          {t('auth.registration.termsAgreePrefix')}{' '}
          <Link className={s.checkBoxLink} href={ROUTES.termsOfService}>
            {t('auth.registration.termsOfService')}
          </Link>{' '}
          {t('auth.registration.and')}{' '}
          <Link className={s.checkBoxLink} href={ROUTES.privacyPolicy}>
            {t('auth.registration.privacyPolicy')}
          </Link>
        </Typography>
      </div>
      <Button disabled={disabled} className={s.submitButton} variant="primary" type="submit">
        {isSubmitting ? <Spinner /> : t('auth.registration.submit')}
      </Button>
    </form>
  )
}
