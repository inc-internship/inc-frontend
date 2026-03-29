import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './Card.module.scss'
import clsx from 'clsx'

type Props = {
  children: ReactNode
} & ComponentPropsWithoutRef<'section'>

export const Card = ({ children, className, ...rest }: Props) => (
  <section className={clsx(s.container, className)} {...rest}>
    {children}
  </section>
)
