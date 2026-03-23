import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './Form.module.scss'

type Props = ComponentPropsWithoutRef<'form'> & {
  /** Form content rendered inside. */
  children: ReactNode
}

export const Form = ({ children, ...rest }: Props) => {
  return (
    <form className={s.container} {...rest}>
      {children}
    </form>
  )
}
