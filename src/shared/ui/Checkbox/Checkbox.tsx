import Image from 'next/image'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { forwardRef } from 'react'
import clsx from 'clsx'

import CheckIcon from '../../../../public/icons/checkmark-outline.svg'

import s from './Checkbox.module.css'
import { Props } from './Checkbox.types'

export const Checkbox = forwardRef<HTMLButtonElement, Props>(
  ({ label, size = 'md', error, disabled, className, ...props }, ref) => {
    return (
      <label className={s.wrapper}>
        <CheckboxPrimitive.Root
          ref={ref}
          disabled={disabled}
          className={clsx(s.root, s[size], error && s.error, disabled && s.disabled, className)}
          {...props}
        >
          <CheckboxPrimitive.Indicator className={s.indicator}>
            <Image src={CheckIcon} alt="" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {label && <span className={s.label}>{label}</span>}
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
