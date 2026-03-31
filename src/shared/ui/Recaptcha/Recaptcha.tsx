'use client'

import s from './Recaptcha.module.scss'
import ReCAPTCHA, { ReCAPTCHAProps } from 'react-google-recaptcha'

type RecaptchaProps = {
  sitekey: string
  onChange?: (token: string | null) => void
  language?: string
  theme?: 'light' | 'dark'
} & Omit<ReCAPTCHAProps, 'sitekey'>

export const Recaptcha = ({
  sitekey,
  onChange,
  language = 'en',
  theme = 'dark',
}: RecaptchaProps) => (
  <div className={s.container}>
    <ReCAPTCHA sitekey={sitekey} onChange={onChange} theme={theme} hl={language} />
  </div>
)
