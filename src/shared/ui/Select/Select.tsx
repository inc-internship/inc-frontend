'use client'

import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import s from './Select.module.scss'
import Image from 'next/image'
import { useI18n } from '@/shared/i18n'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
  iconSrc?: string
}

type SelectVariant = 'outlined' | 'ghost'

type Props = {
  // List of available items in dropdown.
  options: SelectOption[]
  // Currently selected option value. null means "no selection".
  value: string | null
  // Callback fired when user picks an option.
  onChange: (value: string) => void
  // Fallback text shown when value is null.
  placeholder?: string
  // Disables trigger and option selection.
  disabled?: boolean
  // Optional text label displayed above trigger.
  label?: string
  // Optional HTML name attribute for the trigger button.
  name?: string
  // Visual style variant of the Select.
  variant?: SelectVariant
  // Extra class for extending styles from parent.
  className?: string
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  label,
  name,
  variant = 'outlined',
  className,
}: Props) => {
  const { t } = useI18n()
  // Controls dropdown visibility.
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const triggerId = useId()
  const listboxId = `${triggerId}-listbox`

  const selectedOption = options.find(option => option.value === value) ?? null
  const hasIcons = options.some(option => option.iconSrc)

  useEffect(() => {
    // Close menu when user clicks outside Select root.
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
    // Propagate new value to parent and close menu.
    onChange(nextValue)
    setOpen(false)
  }

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    // Keyboard support for accessibility.
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
              alt={t('common.flagAlt', { label: selectedOption.label })}
              width={20}
              height={20}
            />
          )}

          <span className={selectedOption ? s.value : s.placeholder}>
            {selectedOption?.label ?? placeholder ?? t('common.selectPlaceholder')}
          </span>
        </span>
        <span className={clsx(s.chevron, { [s.chevronOpen]: open })} aria-hidden>
          <Image
            src="/icons/ui/arrow-ios-Down-outline.svg"
            alt=""
            width={15}
            height={8}
            className={s.chevronIcon}
          />
        </span>
      </button>

      {open && !disabled && (
        // Render options only while dropdown is open.
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
                      alt={t('common.flagAlt', { label: option.label })}
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
