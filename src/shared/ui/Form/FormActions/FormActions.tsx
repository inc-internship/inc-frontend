import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './FormActions.module.scss'

type Props = ComponentPropsWithoutRef<'div'> & {
  /** Action elements rendered in the form actions area. */
  children: ReactNode
}

export const FormActions = ({ children, ...rest }: Props) => {
  return (
    <div className={s.container} {...rest}>
      {children}
    </div>
  )
}
