'use client'

import clsx from 'clsx'
import { ComponentPropsWithoutRef, ReactNode, forwardRef, useId, useState } from 'react'
import s from './Input.module.scss'
import { EyeOffIcon } from './icons/EyeOffIcon'
import { EyeIcon } from './icons/EyeIcon'
import { SearchIcon } from './icons/SearchIcon'

type InputVariant = 'default' | 'error' | 'search'

type InputWidth = 'full' | 'auto' | 'sm' | 'md' | 'lg'

type Props = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & {
  /** Choose input style variant. Default: 'default'. */
  variant?: InputVariant
  /** Display error message below input and apply error styles. */
  error?: string
  /** Render label text above input. */
  label?: string
  /** Render custom icon on the left side inside input. */
  leftIcon?: ReactNode
  /** Render custom icon on the right side inside input. */
  rightIcon?: ReactNode
  /** Add custom class name for label element. */
  labelClassName?: string
  /** Add custom class name for outer wrapper element. */
  wrapperClassName?: string
  /** Set input width using predefined sizes or custom CSS value. */
  width?: InputWidth | string | number
}

/** Ui kit Input component */
export const Input = forwardRef<HTMLInputElement, Props>(
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
    /** Resolve ids for label and error accessibility bindings. */
    const generatedId = useId()
    const inputId = providedId || generatedId
    const errorId = `error-${inputId}`
    const hasError = !!error || variant === 'error'

    /** Keep local visibility state for password inputs. */
    const [showPassword, setShowPassword] = useState(false)

    /** Derive special input modes from the provided type and variant. */
    const isSearchType = type === 'search' || variant === 'search'
    const isPasswordType = type === 'password'
    const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type

    /** Toggle built-in password visibility control. */
    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev)
    }

    /** Render custom right icon or fallback password toggle control. */
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
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )
      }

      return null
    }

    const rightIconElement = renderRightIcon()

    /** Support both predefined width tokens and custom CSS width values. */
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
