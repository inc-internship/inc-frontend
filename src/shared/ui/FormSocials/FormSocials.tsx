import { Google } from './icons/Google'
import { Github } from './icons/Github'
import s from './FormSocials.module.scss'
import Link from 'next/link'

export const FormSocials = () => (
  <div className={s.container}>
    <Link className={s.link} href="#">
      <Google />
    </Link>
    <Link className={s.link} href="#">
      <Github />
    </Link>
  </div>
)
