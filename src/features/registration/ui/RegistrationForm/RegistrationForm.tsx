import { useMemo } from 'react'
import Link from 'next/link'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ApiErrorResponse } from '@/entities/auth/api/auth.types'
import { useRegisterMutation } from '@/entities/auth'
import { buildRegistrationFormSchema, RegistrationFormField } from '@/features/auth'
import { BASE_URL, ROUTES, getLocalizedRoute } from '@/shared/constants'
import { useI18n } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { CheckBox } from '@/shared/ui/CheckBox'
import { Input } from '@/shared/ui/Input'
import { Spinner } from '@/shared/ui/Spinner'
import { Typography } from '@/shared/ui/Typography'

import s from './RegistrationForm.module.scss'

type Props = {
  onSuccess: (email: string) => void
}

export const RegistrationForm = ({ onSuccess }: Props) => {
  const { locale, t } = useI18n()
  const schema = useMemo(() => buildRegistrationFormSchema(t), [t])
  const [registerUser, { isLoading }] = useRegisterMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormField>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      terms: false,
    },
  })

  const formValues = useWatch({ control })

  const isCurrentFormValid = useMemo(() => {
    return schema.safeParse(formValues).success
  }, [schema, formValues])

  const disabled = isLoading || isSubmitting || !isCurrentFormValid
  const formDisabled = isLoading || isSubmitting

  const onSubmit = async (data: RegistrationFormField) => {
    const isFormValid = await trigger()

    if (!isFormValid) {
      return
    }

    try {
      await registerUser({
        login: data.userName,
        email: data.email,
        password: data.password,
        redirectUrl: `${BASE_URL}${getLocalizedRoute(locale, ROUTES.emailConfirmed)}`,
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
          {...register('password', {
            onBlur: () => {
              void trigger(['password', 'passwordConfirm'])
            },
          })}
          disabled={formDisabled}
        />

        <Input
          type="password"
          label={t('common.passwordConfirmation')}
          placeholder="******************"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm', {
            onBlur: () => {
              void trigger(['password', 'passwordConfirm'])
            },
          })}
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
          <Link className={s.checkBoxLink} href={getLocalizedRoute(locale, ROUTES.termsOfService)}>
            {t('auth.registration.termsOfService')}
          </Link>{' '}
          {t('auth.registration.and')}{' '}
          <Link className={s.checkBoxLink} href={getLocalizedRoute(locale, ROUTES.privacyPolicy)}>
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
