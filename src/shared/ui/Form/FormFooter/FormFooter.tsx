import { ComponentPropsWithoutRef, ReactNode } from 'react'
import clsx from 'clsx'
import s from './FormFooter.module.scss'

type Props = ComponentPropsWithoutRef<'div'> & {
  /** Footer content rendered inside the group */
  children: ReactNode
}

export const FormFooter = ({ children, className, ...rest }: Props) => {
  return (
    <div className={clsx(s.container, className)} {...rest}>
      {children}
    </div>
  )
}
