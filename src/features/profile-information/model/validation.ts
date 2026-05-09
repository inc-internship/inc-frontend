import { z } from 'zod'

export const profileSchema = z.object({
  username: z
    .string()
    .min(6, 'Минимум 6 символов')
    .max(30, 'Максимум 30 символов')
    .regex(/^[A-Za-z0-9_-]+$/, 'Только латинские буквы, цифры, "_" и "-"'),

  firstname: z
    .string()
    .min(1, 'Введите имя')
    .max(50, 'Максимум 50 символов')
    .regex(/^[A-Za-zА-Яа-яЁё]+$/, 'Только русские и латинские буквы'),

  lastname: z
    .string()
    .min(1, 'Введите фамилию')
    .max(50, 'Максимум 50 символов')
    .regex(/^[A-Za-zА-Яа-яЁё]+$/, 'Только русские и латинские буквы'),

  dateOfBirth: z.date().refine(date => {
    const today = new Date()

    const minDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())

    return date <= minDate
  }, 'Возраст должен быть больше 13 лет'),

  aboutMe: z.string().max(200, 'Максимум 200 символов').optional(),

  country: z.string().min(1, 'Выберите страну'),

  city: z.string().min(1, 'Выберите город'),
})
