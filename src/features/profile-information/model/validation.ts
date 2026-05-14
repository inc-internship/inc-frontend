import { z } from 'zod'

export const profileFormSchema = (t: (key: string) => string) =>
  z.object({
    username: z
      .string()
      .min(6, t('profile.userNameErrorMin'))
      .max(30, t('profile.userNameErrorMax'))
      .regex(/^[A-Za-z0-9_-]+$/, t('profile.userNameErrorValidCharacters')),

    firstname: z
      .string()
      .min(1, t('profile.firstNameErrorMin'))
      .max(50, t('profile.firstNameErrorMax'))
      .regex(/^[A-Za-zА-Яа-яЁё]+$/, t('profile.firstNameLastNameErrorValidCharacters')),

    lastname: z
      .string()
      .min(1, t('profile.lastNameErrorMin'))
      .max(50, t('profile.lastNameErrorMax'))
      .regex(/^[A-Za-zА-Яа-яЁё]+$/, t('profile.firstNameLastNameErrorValidCharacters')),

    dateOfBirth: z.date().refine(date => {
      const today = new Date()

      const minDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())

      return date <= minDate
    }, t('profile.ageError')),

    aboutMe: z.string().max(200, 'Максимум 200 символов').optional(),

    country: z.string().min(1, 'Выберите страну').optional(),

    city: z.string().min(1, 'Выберите город').optional(),
  })

export type ProfileFormValues = z.infer<ReturnType<typeof profileFormSchema>>
