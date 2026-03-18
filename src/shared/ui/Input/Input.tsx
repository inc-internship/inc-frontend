'use client'

import clsx from 'clsx'
import { ComponentPropsWithoutRef, ReactNode, forwardRef, useId, useState } from 'react'

import s from './Input.module.scss'

import { SearchIcon, EyeIcon, EyeOffIcon } from './icons'

type InputVariant = 'default' | 'error' | 'search'

type InputWidth = 'full' | 'auto' | 'sm' | 'md' | 'lg'

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & {
  variant?: InputVariant
  error?: string
  label?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  labelClassName?: string
  wrapperClassName?: string
  onSearch?: () => void
  width?: InputWidth | string | number
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      disabled,
      error,
      label,
      labelClassName,
      wrapperClassName,
      className,
      id: providedId,
      leftIcon,
      rightIcon,
      type = 'text',
      width,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = providedId || generatedId
    const errorId = `error-${inputId}`
    const hasError = !!error || variant === 'error'

    const [showPassword, setShowPassword] = useState(false)

    const isSearchType = type === 'search' || variant === 'search'

    const isPasswordType = type === 'password'

    const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev)
    }

    const renderRightIcon = () => {
      if (rightIcon) {
        return <span className={s.rightIcon}>{rightIcon}</span>
      } else if (isPasswordType) {
        return (
          <button
            type="button"
            className={s.passwordToggle}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={disabled}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )
      }

      return null
    }

    const rightIconElement = renderRightIcon()

    const isPredefinedWidth =
      typeof width === 'string' && ['full', 'auto', 'sm', 'md', 'lg'].includes(width)

    return (
      <div
        className={clsx(
          s.wrapper,
          wrapperClassName,
          { [s.disabled]: disabled },
          isPredefinedWidth && s[`width-${width}`],
        )}
        style={!isPredefinedWidth && width ? { width } : undefined}
      >
        {label && (
          <label htmlFor={inputId} className={clsx(s.label, labelClassName)}>
            {label}
          </label>
        )}

        <div
          className={clsx(s.inputContainer, {
            [s.hasLeftIcon]: leftIcon || isSearchType,
            [s.hasRightIcon]: !!(rightIcon || isPasswordType),
          })}
        >
          {leftIcon && <span className={s.leftIcon}>{leftIcon}</span>}
          {isSearchType && !leftIcon && (
            <span className={s.leftIcon}>
              <SearchIcon />
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            className={clsx(
              s.input,
              {
                [s.error]: hasError,
                [s.disabled]: disabled,
                [s.searchInput]: isSearchType && !leftIcon,
              },
              className,
            )}
            {...props}
          />

          {rightIconElement && <span className={s.rightIcon}>{rightIconElement}</span>}
        </div>

        {error && (
          <span id={errorId} className={s.errorText} role="alert">
            {error}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
