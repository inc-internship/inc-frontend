'use client'

import { useForm, Controller } from 'react-hook-form'
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
import { ru } from 'date-fns/locale'
import { format } from 'date-fns'
import { TextArea } from '@/shared/ui/TextArea'
import { useI18n } from '@/shared/i18n'
import { toast } from 'react-toastify'
import { getLocalizedRoute, ROUTES } from '@/shared/constants'
import Link from 'next/link'
// import {useFillProfileMutation, useUpdateProfileMutation, useGetProfileQuery} from "@/entities/user/api/user.api";//раскомментировать, строку ниже удалить
import { useUpdateProfileMutation } from '@/entities/user/api/user.api'
// import {FillProfileRequest, UpdateProfileRequest} from "@/entities/user/api/user.types";//аскомментировать, строку ниже удалить
import { UpdateProfileRequest } from '@/entities/user/api/user.types'
// import { getApiErrorMessage, isClientError } from '@/shared/api'//rjulf ,eltn ,trtyl

export const ProfileInformationForm = () => {
  const user = useSelector(selectUser)

  const { locale, t } = useI18n()

  const schema = useMemo(() => profileFormSchema(t), [t])

  // const [editProfile, { isLoading }] = useEditProfileMutation() когда бэкенд будет

  // const [fillProfile, { isLoading: isFilling }] = useFillProfileMutation()
  // const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  // const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery()//ти три строчки раскомментировать, строку ниже удалить

  const [updateProfile] = useUpdateProfileMutation()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.login,
      dateOfBirth: undefined,
    },
    mode: 'onBlur',
  })

  const submitHandler = async (data: ProfileFormValues) => {
    // const payload = {
    //   firstName: "Роман",
    //   lastName: "Насачевский",
    //   birthday: "2000-01-01T00:00:00.000Z",
    //   // countryId: "550e8400-e29b-41d4-a716-446655440000",
    //   countryId: "Россия",
    //   cityId: "Братск",
    //   aboutMe: "верстальщик",
    // };
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

    console.log('Отправляемые данные:', payload)

    try {
      await updateProfile(payload).unwrap()
      toast.success(t('profile.updateSuccess'))
    } catch (error: unknown) {
      // toast.error(t('common.somethingWentWrong'))
      const message = error?.data?.message || t('common.somethingWentWrong')
      toast.error(message)
      console.error(message)
    }
  }

  return (
    <form className={s.form} onSubmit={handleSubmit(submitHandler)}>
      <Input
        label="Username"
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
            locale={ru}
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
                        rel="noopener noreferrer"
                        className={s.privacyPolicyLink}
                      >
                        Privacy Policy
                      </Link>
                    </>
                  )}
                </span>
              ) : undefined
            }
            placeholder="00.00.0000"
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

      <Button type="submit" variant="primary" disabled={isSubmitting} className={s.submitButton}>
        {t('profile.informationFormSubmitButton')}
      </Button>
    </form>
  )
}

// Invalid `prisma.user.update()` invocation:
//
//
// An operation failed because it depends on one or more records that were required but not found. No 'Profile' record was found for a nested update on one-to-one relation 'ProfileToUser'.

//ProfileInformationForm.tsx:87 No handler found for the command: "UpdateProfileCommand"
