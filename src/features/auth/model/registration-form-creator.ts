import { z } from 'zod/v4'
import { DEFAULT_LOCALE } from '@/shared/i18n/config'
import { translate } from '@/shared/i18n/translate'
import type { TranslationParams } from '@/shared/i18n/types'

export const MIN_PASSWORD_LENGTH = 6
export const MAX_PASSWORD_LENGTH = 20
export const MIN_USERNAME_LENGTH = 6
export const MAX_USERNAME_LENGTH = 30

type Translator = (key: string, params?: TranslationParams) => string

const defaultTranslate: Translator = (key, params) => translate(DEFAULT_LOCALE, key, params)

const createPasswordSchema = (t: Translator) =>
  z
    .string()
    .min(MIN_PASSWORD_LENGTH, t('validation.password.min', { count: MIN_PASSWORD_LENGTH }))
    .max(MAX_PASSWORD_LENGTH, t('validation.password.max', { count: MAX_PASSWORD_LENGTH }))
    .regex(/[0-9]/, t('validation.password.number'))
    .regex(/[a-z]/, t('validation.password.lowercase'))
    .regex(/[A-Z]/, t('validation.password.uppercase'))
    .regex(
      /^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~]+$/,
      t('validation.password.invalidChars'),
    )

export const buildRegistrationFormSchema = (t: Translator = defaultTranslate) => {
  const passwordSchema = createPasswordSchema(t)

  return z
    .object({
      userName: z
        .string()
        .min(MIN_USERNAME_LENGTH, t('validation.username.min', { count: MIN_USERNAME_LENGTH }))
        .max(MAX_USERNAME_LENGTH, t('validation.username.max', { count: MAX_USERNAME_LENGTH }))
        .regex(/^[A-Za-z0-9_-]+$/, t('validation.username.allowedChars')),
      email: z.email(t('validation.email.format')),
      password: passwordSchema,
      passwordConfirm: passwordSchema,
      terms: z.boolean().refine(val => val, {
        error: t('validation.terms.required'),
      }),
    })
    .refine(data => data.password === data.passwordConfirm, {
      error: t('validation.passwordsMatch'),
      path: ['passwordConfirm'],
    })
}

export const registrationFormSchema = buildRegistrationFormSchema()
