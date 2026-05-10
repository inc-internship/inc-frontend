'use client'

import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { z } from 'zod'
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

type FormValues = z.infer<typeof profileFormSchema>

export const ProfileInformationForm = () => {
  const user = useSelector(selectUser)

  const { t } = useI18n()

  const schema = useMemo(() => profileFormSchema(t), [t])

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

  const submitHandler = (data: ProfileFormValues) => {
    const payload = {
      ...data,
      dateOfBirth: format(data.dateOfBirth, 'yyyy.MM.dd'),
    }

    console.log('Отправляемые данные:', payload)
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
            error={errors.dateOfBirth?.message}
            placeholder="00.00.0000"
            disabled={isSubmitting}
          />
        )}
      />

      <SelectCountryCity<ProfileFormValues>
        control={control}
        countryName="country"
        cityName="city"
        // при желании можно передать cityLabel и countryLabel, если нужны переводы
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
