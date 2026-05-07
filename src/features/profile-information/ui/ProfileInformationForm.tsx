'use client'

import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import s from './ProfileInformationForm.module.scss'
import { selectUser } from '@/entities/user/user.slice'
import { useSelector } from 'react-redux'
import { profileSchema } from '@/features/profile-information/model/validation'
import SelectCountryCity from '@/shared/ui/SelectCountryCity/SelectCountryCity'
import { DatePicker } from '@/shared/ui/DatePicker'
import { ru } from 'date-fns/locale'
import { format } from 'date-fns'

type FormValues = z.infer<typeof profileSchema>

export const ProfileInformationForm = () => {
  const user = useSelector(selectUser)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.login,
      dateOfBirth: undefined,
    },
    mode: 'onBlur',
  })

  const submitHandler = (data: FormValues) => {
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
        label="First name"
        placeholder=""
        error={errors.firstname?.message}
        {...register('firstname')}
        disabled={isSubmitting}
        width="full"
      />
      <Input
        label="Last name"
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
            label="Date of birth"
            locale={ru}
            value={field.value}
            onChange={field.onChange}
            error={errors.dateOfBirth?.message}
            placeholder="00.00.0000"
            disabled={isSubmitting}
          />
        )}
      />

      <SelectCountryCity<FormValues>
        control={control}
        countryName="country"
        cityName="city"
        // при желании можно передать cityLabel и countryLabel, если нужны переводы
      />

      <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}
