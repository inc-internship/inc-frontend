'use client'

import * as Checkbox from '@radix-ui/react-checkbox'
import { forwardRef } from 'react'
import clsx from 'clsx'
import s from './CheckBox.module.scss'
import { CheckIcon } from './CheckIcon/CheckIcon'

type CheckboxSize = 'sm' | 'md' | 'lg'
type CheckboxVariant = 'default' | 'error'

type Props = Checkbox.CheckboxProps & {
  label?: string
  size?: CheckboxSize
  variant?: CheckboxVariant
  error?: boolean
}

export const CheckBox = forwardRef<HTMLButtonElement, Props>(
  ({ label, size = 'md', error, disabled, className, ...props }, ref) => (
    <label className={clsx(s.wrapper, disabled && s.disabledWrapper)}>
      <Checkbox.Root
        ref={ref}
        disabled={disabled}
        className={clsx(s.root, s[size], error && s.error, disabled && s.disabled, className)}
        {...props}
      >
        <Checkbox.Indicator className={s.indicator}>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      {label && <span className={clsx(s.label, disabled && s.disabledLabel)}>{label}</span>}
    </label>
  ),
)

CheckBox.displayName = 'CheckBox'
