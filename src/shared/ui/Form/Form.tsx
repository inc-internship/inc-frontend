import clsx from 'clsx'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './Form.module.scss'

type Props = ComponentPropsWithoutRef<'form'> & {
  /** Form content rendered inside. */
  children: ReactNode
}

export const Form = ({ children, className, ...rest }: Props) => {
  return (
    <form className={clsx(s.container, className)} {...rest}>
      {children}
    </form>
  )
}
