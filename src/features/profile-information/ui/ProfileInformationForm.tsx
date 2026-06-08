'use client'

import { useForm, Controller } from 'react-hook-form'
import { useEffect } from 'react'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import s from './ProfileInformationForm.module.scss'
import { selectUser } from '@/entities/user/user.slice'
import { useSelector } from 'react-redux'
import {
  profileFormSchema,
  type ProfileFormValues,
} from '@/features/profile-information/model/validation'
import SelectCountryCity from '@/shared/ui/SelectCountryCity/SelectCountryCity'
import { DatePicker } from '@/shared/ui/DatePicker'
import { ru, enUS } from 'date-fns/locale'
import { format } from 'date-fns'
import { TextArea } from '@/shared/ui/TextArea'
import { useI18n } from '@/shared/i18n'
import { toast } from 'react-toastify'
import { getLocalizedRoute, ROUTES } from '@/shared/constants'
import Link from 'next/link'
import { useUpdateProfileMutation, useGetProfileQuery } from '@/entities/user/api/user.api' //раскомментировать, строку ниже удалить
import { UpdateProfileRequest } from '@/entities/user/api/user.types'

export const ProfileInformationForm = () => {
  const user = useSelector(selectUser)

  const userId = user?.publicId

  const { data: profile } = useGetProfileQuery(userId!, {
    skip: !userId,
  })

  const { locale, t } = useI18n()

  const dateLocale = useMemo(() => {
    return locale === 'ru' ? ru : enUS
  }, [locale])

  const schema = useMemo(() => profileFormSchema(t), [t])

  const [updateProfile] = useUpdateProfileMutation()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.login,
      dateOfBirth: undefined,
    },
    // mode: 'onBlur',
    mode: 'onChange',
  })

  useEffect(() => {
    if (profile) {
      reset({
        username: user?.login,
        firstname: profile.firstName || '',
        lastname: profile.lastName || '',
        dateOfBirth: profile.birthday ? new Date(profile.birthday) : undefined,
        aboutMe: profile.aboutMe || '',
        country: profile.countryId ?? undefined,
        city: profile.cityId ?? undefined,
      })
    }
  }, [profile, reset, user?.login])

  const submitHandler = async (data: ProfileFormValues) => {
    const payload: UpdateProfileRequest = {
      firstName: data.firstname,
      lastName: data.lastname,
      aboutMe: data.aboutMe || '',
      countryId: data.country,
      cityId: data.city,
    }

    if (data.dateOfBirth) {
      payload.birthday = format(data.dateOfBirth, 'yyyy-MM-dd') + 'T00:00:00.000Z'
    }

    try {
      await updateProfile(payload).unwrap()
      toast.success(t('profile.updateSuccess'))
    } catch (error: unknown) {
      toast.error(t('common.somethingWentWrong'))
    }
  }

  return (
    <form className={s.form} onSubmit={handleSubmit(submitHandler)}>
      <Input
        label={t('profile.informationFormUserNameLabel')}
        placeholder=""
        error={errors.username?.message}
        {...register('username')}
        disabled={isSubmitting}
        width="full"
      />
      <Input
        label={t('profile.informationFormFirstNameLabel')}
        placeholder=""
        error={errors.firstname?.message}
        {...register('firstname')}
        disabled={isSubmitting}
        width="full"
      />
      <Input
        label={t('profile.informationFormLastNameLabel')}
        placeholder=""
        error={errors.lastname?.message}
        {...register('lastname')}
        disabled={isSubmitting}
        width="full"
      />

      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field }) => (
          <DatePicker
            mode="single"
            label={t('profile.informationFormDateOfBirthLabel')}
            locale={dateLocale}
            value={field.value}
            onChange={field.onChange}
            error={
              errors.dateOfBirth ? (
                <span>
                  {errors.dateOfBirth.type === 'invalid_type' ? (
                    t('profile.dateOfBirthRequired')
                  ) : (
                    <>
                      {errors.dateOfBirth.message}{' '}
                      <Link
                        href={getLocalizedRoute(locale, ROUTES.privacyPolicy)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.privacyPolicyLink}
                      >
                        {t('auth.registration.privacyPolicy')}
                      </Link>
                    </>
                  )}
                </span>
              ) : undefined
            }
            placeholder=""
            disabled={isSubmitting}
          />
        )}
      />

      <SelectCountryCity<ProfileFormValues>
        control={control}
        countryName="country"
        cityName="city"
        // ереводы можно сделать
      />

      <TextArea
        className={s.aboutMeField}
        label={t('profile.informationFormAboutMeTextAreaLabel')}
        placeholder="Text-area"
        rows={7}
        maxLength={200}
        {...register('aboutMe')}
        error={errors.aboutMe?.message}
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || !isValid || !isDirty}
        className={s.submitButton}
      >
        {t('profile.informationFormSubmitButton')}
      </Button>
    </form>
  )
}
