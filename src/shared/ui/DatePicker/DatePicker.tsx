'use client'

import { format, type Locale } from 'date-fns'
import { useEffect, useId, useRef, useState, type ComponentProps } from 'react'
import { type DateRange, DayPicker } from 'react-day-picker'

import { ArrowLeft, ArrowRight, Calendar } from './DatePickerIcon'

import s from './DatePicker.module.scss'

type CommonDatePickerProps = {
  label?: string
  error?: string
  disabled?: boolean
  placeholder?: string
  locale: Locale
}

export type DatePickerProps =
  | (CommonDatePickerProps & {
      mode: 'single'
      value?: Date
      onChange: (date?: Date) => void
    })
  | (CommonDatePickerProps & {
      mode: 'range'
      value?: DateRange
      onChange: (range?: DateRange) => void
    })

const dayPickerComponents = {
  PreviousMonthButton: (props: ComponentProps<'button'>) => (
    <button {...props} type="button" className={s.navButton}>
      <ArrowLeft />
    </button>
  ),

  NextMonthButton: (props: ComponentProps<'button'>) => (
    <button {...props} type="button" className={s.navButton}>
      <ArrowRight />
    </button>
  ),
}

const baseClassNames = {
  root: s.calendar,
  months: s.months,
  month: s.month,
  nav: s.nav,
  month_caption: s.monthCaption,
  caption_label: s.captionLabel,
  day: s.day,
  day_button: s.dayButton,
  selected: s.selected,
  today: s.today,
  disabled: s.disabledDay,
  outside: s.outside,
  weekdays: s.weekDays,
}

const rangeClassNames = {
  ...baseClassNames,
  range_start: s.rangeStart,
  range_middle: s.rangeMiddle,
  range_end: s.rangeEnd,
}

export const DatePicker = (props: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const triggerId = useId()
  const errorId = `${triggerId}-error`

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleTriggerClick = () => {
    setIsOpen(prev => !prev)
  }

  const handleSingleSelect = (date?: Date) => {
    if (props.mode !== 'single') return

    props.onChange(date)

    if (date) {
      setIsOpen(false)
    }
  }

  const handleRangeSelect = (range?: DateRange) => {
    if (props.mode !== 'range') return

    props.onChange(range)
  }

  const inputValue =
    props.mode === 'single'
      ? props.value
        ? format(props.value, 'dd/MM/yyyy')
        : ''
      : props.value?.from && props.value?.to
        ? `${format(props.value.from, 'dd/MM/yyyy')} - ${format(props.value.to, 'dd/MM/yyyy')}`
        : ''

  return (
    <div className={s.root} ref={rootRef}>
      {props.label && (
        <label className={s.label} htmlFor={triggerId}>
          {props.label}
        </label>
      )}

      <button
        id={triggerId}
        type="button"
        className={`${s.trigger} ${props.error ? s.triggerError : ''}`}
        disabled={props.disabled}
        onClick={handleTriggerClick}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-describedby={props.error ? errorId : undefined}
      >
        <span>{inputValue || props.placeholder || 'Date select'}</span>
        <Calendar />
      </button>

      {isOpen && (
        <div className={s.popover} role="dialog">
          {props.mode === 'single' ? (
            <DayPicker
              locale={props.locale}
              mode="single"
              selected={props.value}
              onSelect={handleSingleSelect}
              components={dayPickerComponents}
              classNames={baseClassNames}
              modifiers={{ weekend: { dayOfWeek: [0, 6] } }}
              modifiersClassNames={{ weekend: s.weekend }}
            />
          ) : (
            <DayPicker
              locale={props.locale}
              mode="range"
              selected={props.value}
              onSelect={handleRangeSelect}
              components={dayPickerComponents}
              classNames={rangeClassNames}
              modifiers={{ weekend: { dayOfWeek: [0, 6] } }}
              modifiersClassNames={{ weekend: s.weekend }}
            />
          )}
        </div>
      )}

      {props.error && (
        <span id={errorId} className={s.error}>
          {props.error}
        </span>
      )}
    </div>
  )
}
