import { API_V1_URL } from '@/shared/constants'
import { Google } from './icons/Google'
import { Github } from './icons/Github'
import s from './FormSocials.module.scss'

export const FormSocials = () => (
  <div className={s.container}>
    <a className={s.link} href={`${API_V1_URL}/oauth/google`} aria-label="Continue with Google">
      <Google />
    </a>

    <a className={s.link} href={`${API_V1_URL}/oauth/github`} aria-label="Continue with GitHub">
      <Github />
    </a>
  </div>
)
