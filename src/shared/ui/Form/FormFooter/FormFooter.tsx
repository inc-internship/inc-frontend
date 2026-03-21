import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './FormFooter.module.scss'

type Props = ComponentPropsWithoutRef<'div'> & {
  /** Footer content rendered inside the group */
  children: ReactNode
}

export const FormFooter = ({ children, ...rest }: Props) => {
  return (
    <div className={s.container} {...rest}>
      {children}
    </div>
  )
}
