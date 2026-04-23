import z from 'zod/v4'
import { DEFAULT_LOCALE } from '@/shared/i18n/config'
import { translate } from '@/shared/i18n/translate'
import type { TranslationParams } from '@/shared/i18n/types'

type Translator = (key: string, params?: TranslationParams) => string

const defaultTranslate: Translator = (key, params) => translate(DEFAULT_LOCALE, key, params)

export const buildLoginFormSchema = (t: Translator = defaultTranslate) =>
  z.object({
    email: z.email(t('validation.email.format')),
    password: z.string().nonempty({ error: t('validation.password.required') }),
  })

export const loginFormSchema = buildLoginFormSchema()
