import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './Card.module.scss'

type Props = {
  children: ReactNode
} & ComponentPropsWithoutRef<'section'>

export const Card = ({ children }: Props) => <section className={s.container}>{children}</section>
