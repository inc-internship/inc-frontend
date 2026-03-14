'use client'

import { type TextareaHTMLAttributes, forwardRef, useId } from 'react'
import clsx from 'clsx'
import s from './TextArea.module.scss'

const mergeIds = (...ids: Array<string | undefined>) => ids.filter(Boolean).join(' ') || undefined

export type TextAreaSize = 'sm' | 'md' | 'lg'

const sizeClassNameMap: Record<TextAreaSize, string> = {
  sm: s.sizeSm,
  md: s.sizeMd,
  lg: s.sizeLg,
}

export type TextAreaProps = {
  className?: string
  error?: string
  hideLabel?: boolean
  label: string
  size?: TextAreaSize
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    disabled,
    error,
    hideLabel = false,
    id,
    label,
    className,
    rows = 3,
    size = 'sm',
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...restProps
  },
  ref,
) {
  const fallbackId = useId()
  const textAreaId = id ?? fallbackId
  const errorId = error ? `${textAreaId}-error` : undefined
  const describedBy = mergeIds(ariaDescribedBy, errorId)

  return (
    <label className={clsx(s.customTextArea, className)} data-disabled={disabled}>
      <span className={clsx(s.label, hideLabel && s.visuallyHidden)}>{label}</span>

      <div
        className={clsx(s.container, sizeClassNameMap[size], error && s.containerError)}
        data-disabled={disabled}
      >
        <textarea
          {...restProps}
          aria-describedby={describedBy}
          aria-invalid={error ? true : ariaInvalid}
          className={s.textArea}
          disabled={disabled}
          id={textAreaId}
          ref={ref}
          rows={rows}
        />
      </div>

      {error && (
        <span className={s.errorMessage} id={errorId} role="alert">
          {error}
        </span>
      )}
    </label>
  )
})
