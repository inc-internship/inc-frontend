import z from 'zod/v4'
import { DEFAULT_LOCALE } from '@/shared/i18n/config'
import { translate } from '@/shared/i18n/translate'
import type { TranslationParams } from '@/shared/i18n/types'

export const MIN_PASSWORD_LENGTH = 6
export const MAX_PASSWORD_LENGTH = 20

type Translator = (key: string, params?: TranslationParams) => string

const defaultTranslate: Translator = (key, params) => translate(DEFAULT_LOCALE, key, params)

const passwordComplexityPattern =
  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~]+$/

export const buildCreateNewPasswordFormSchema = (t: Translator = defaultTranslate) =>
  z
    .object({
      newPassword: z
        .string()
        .nonempty({ error: t('validation.newPassword.required') })
        .min(MIN_PASSWORD_LENGTH, {
          error: t('validation.password.min', { count: MIN_PASSWORD_LENGTH }),
        })
        .max(MAX_PASSWORD_LENGTH, {
          error: t('validation.password.max', { count: MAX_PASSWORD_LENGTH }),
        })
        .regex(passwordComplexityPattern, { error: t('validation.password.complexity') }),
      passwordConfirmation: z
        .string()
        .nonempty({ error: t('validation.passwordConfirmation.required') }),
    })
    .refine(({ newPassword, passwordConfirmation }) => newPassword === passwordConfirmation, {
      error: t('validation.passwordsMatch'),
      path: ['passwordConfirmation'],
    })

export const createNewPasswordFormSchema = buildCreateNewPasswordFormSchema()
