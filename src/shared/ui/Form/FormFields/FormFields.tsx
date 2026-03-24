import { ComponentPropsWithoutRef, ReactNode } from 'react'
import clsx from 'clsx'
import s from './FormFields.module.scss'

type Props = ComponentPropsWithoutRef<'div'> & {
  /** Form fields rendered inside the group. */
  children: ReactNode
}

export const FormFields = ({ children, className, ...rest }: Props) => {
  return (
    <div className={clsx(s.container, className)} {...rest}>
      {children}
    </div>
  )
}
