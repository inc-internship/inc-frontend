'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import s from './ProfileInformationForm.module.scss'

const buildProfileSchema = () =>
  z.object({
    username: z.string().min(6, 'Минимум 6 символов').max(30, 'Максимум 30 символов'),
    firstname: z.string().min(1, 'Минимум 1 имвол').max(50, 'Максимум 50 символов'),
    lastname: z.string().min(1, 'Минимум 1 символ').max(50, 'Максимум 50 символов'),
  })

type FormValues = z.infer<ReturnType<typeof buildProfileSchema>>

export const ProfileInformationForm = () => {
  const schema = buildProfileSchema()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: 'username',
    },
    mode: 'onBlur',
  })

  const submitHandler = () => {}

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

      <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}
