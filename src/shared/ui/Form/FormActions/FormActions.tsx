import clsx from 'clsx'
import s from './FormActions.module.scss'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

type Props = ComponentPropsWithoutRef<'div'> & {
  /** Action elements rendered in the form actions area. */
  children: ReactNode
}

export const FormActions = ({ children, className, ...rest }: Props) => {
  return (
    <div className={clsx(s.container, className)} {...rest}>
      {children}
    </div>
  )
}
