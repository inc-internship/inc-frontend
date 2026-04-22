'use client'

import s from './Recaptcha.module.scss'
import ReCAPTCHA, { ReCAPTCHAProps } from 'react-google-recaptcha'
import { useI18n } from '@/shared/i18n'

type RecaptchaProps = {
  sitekey: string
  onChange?: (token: string | null) => void
  language?: string
  theme?: 'light' | 'dark'
} & Omit<ReCAPTCHAProps, 'sitekey'>

export const Recaptcha = ({ sitekey, onChange, language, theme = 'dark' }: RecaptchaProps) => {
  const { locale } = useI18n()

  return (
    <div className={s.container}>
      <ReCAPTCHA sitekey={sitekey} onChange={onChange} theme={theme} hl={language ?? locale} />
    </div>
  )
}
