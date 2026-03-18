'use client'

import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import s from './Select.module.scss'
import Image from 'next/image'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
  iconSrc?: string
}

type SelectVariant = 'outlined' | 'ghost'

type SelectProps = {
  options: SelectOption[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  name?: string
  variant?: SelectVariant
  className?: string
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select-box',
  disabled = false,
  label,
  name,
  variant = 'outlined',
  className,
}: SelectProps) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const triggerId = useId()
  const listboxId = `${triggerId}-listbox`

  const selectedOption = options.find(option => option.value === value) ?? null
  const hasIcons = options.some(option => option.iconSrc)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('pointerdown', handleOutsideClick)
    return () => window.removeEventListener('pointerdown', handleOutsideClick)
  }, [])

  const selectOption = (nextValue: string, optionDisabled?: boolean) => {
    if (disabled || optionDisabled) return
    onChange(nextValue)
    setOpen(false)
  }

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(prev => !prev)
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div
      ref={rootRef}
      className={clsx(
        s.root,
        s[`variant_${variant}`],
        {
          [s.state_active]: open,
          [s.state_disabled]: disabled,
        },
        className,
      )}
      data-disabled={disabled}
      data-has-icons={hasIcons ? 'true' : 'false'}
    >
      {label && (
        <label className={s.label} htmlFor={triggerId}>
          {label}
        </label>
      )}

      <button
        id={triggerId}
        type="button"
        name={name}
        className={s.trigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => setOpen(prev => !prev)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={s.content}>
          {selectedOption?.iconSrc && (
            <Image
              className={s.icon}
              src={selectedOption.iconSrc}
              alt={`flag ${selectedOption.label}`}
              width={20}
              height={20}
            />
          )}

          <span className={selectedOption ? s.value : s.placeholder}>
            {selectedOption?.label ?? placeholder}
          </span>
        </span>

        <span className={clsx(s.chevron, { [s.chevronOpen]: open })} aria-hidden>
          <svg width="15" height="8" viewBox="0 0 15 8" fill="none">
            <path
              d="M0.00176807 1.00176L7.00177 6.83176L14.0018 1.00176"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {open && !disabled && (
        <ul id={listboxId} className={s.menu} role="listbox" aria-labelledby={triggerId}>
          {options.map(option => {
            const isSelected = option.value === value

            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={clsx(s.option, { [s.optionSelected]: isSelected })}
                  disabled={option.disabled}
                  onClick={() => selectOption(option.value, option.disabled)}
                >
                  {option.iconSrc && (
                    <Image
                      className={s.icon}
                      src={option.iconSrc}
                      alt={`flag ${option.label}`}
                      width={20}
                      height={20}
                    />
                  )}
                  <span className={s.label}>{option.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
