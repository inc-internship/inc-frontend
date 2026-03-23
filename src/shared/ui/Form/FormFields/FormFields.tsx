import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './FormFields.module.scss'

type Props = ComponentPropsWithoutRef<'div'> & {
  /** Form fields rendered inside the group. */
  children: ReactNode
}

export const FormFields = ({ children, ...rest }: Props) => {
  return (
    <div className={s.container} {...rest}>
      {children}
    </div>
  )
}
