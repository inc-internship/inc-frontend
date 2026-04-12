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
  /** Add icon styles if is true */
  iconOnly?: boolean
  /** Add background to the icon if is true */
  hasIconBackground?: boolean
} & ComponentPropsWithoutRef<'button'>

/** Ui kit Button component */
export const Button = ({
  variant = 'default',
  className,
  type = 'button',
  fullWidth = false,
  asChild,
  iconOnly,
  hasIconBackground,
  ...rest
}: Props) => {
  const Component = asChild ? Slot : 'button'

  if (iconOnly) {
    return (
      <Component
        className={clsx(s.icon, { [s.iconBackground]: hasIconBackground }, className)}
        type={type}
        {...rest}
        onClick={rest.onClick}
      />
    )
  }

  return (
    <Component
      className={clsx(s.button, s[variant], { [s.fullWidth]: fullWidth }, className)}
      type={type}
      {...rest}
      onClick={rest.onClick}
    />
  )
}
