'use client'

import { ComponentPropsWithoutRef } from 'react'
import s from './Button.module.scss'
import clsx from 'clsx'
import { Slot } from '@radix-ui/react-slot'

type Props = {
  /** Choose from 4 style variants. Default: 'default'. */
  variant?: 'default' | 'primary' | 'outlined' | 'secondary'
  /** Render Button using any element if asChild is true */
  asChild?: boolean
  /** Sets full width if is true */
  fullWidth?: boolean
} & ComponentPropsWithoutRef<'button'>

/** Ui kit Button component */
export const Button = ({
  variant = 'default',
  className,
  type = 'button',
  fullWidth = false,
  asChild,
  ...rest
}: Props) => {
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      className={clsx(s.button, s[variant], { [s.fullWidth]: fullWidth }, className)}
      type={type}
      {...rest}
      onClick={rest.onClick}
    />
  )
}
