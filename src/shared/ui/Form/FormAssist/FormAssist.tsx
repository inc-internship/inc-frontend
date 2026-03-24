import { ComponentPropsWithoutRef, ReactNode } from 'react'
import clsx from 'clsx'
import s from './FormAssist.module.scss'

type Props = ComponentPropsWithoutRef<'div'> & {
  /** Hints rendered inside the Form. */
  children: ReactNode
  /** Sets left or right horizontal alignment of the assist content. */
  align?: 'left' | 'right'
}

export const FormAssist = ({ children, align = 'left', className, ...rest }: Props) => {
  return (
    <div className={clsx(s.container, s[align], className)} {...rest}>
      {children}
    </div>
  )
}
