import clsx from 'clsx'
import React, { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './Form.module.scss'

type Props = ComponentPropsWithoutRef<'form'> & {
  /** Form content rendered inside. */
  children: ReactNode
}

export const Form = ({ children, className, onSubmit, ...rest }: Props) => {
  const onSubmitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit?.(e)
  }

  return (
    <form className={clsx(s.container, className)} onSubmit={e => onSubmitHandler(e)} {...rest}>
      {children}
    </form>
  )
}
