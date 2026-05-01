'use client'

import { format, type Locale } from 'date-fns'
import { useEffect, useId, useRef, useState, type ComponentProps } from 'react'
import { type DateRange, DayPicker } from 'react-day-picker'

import { ArrowLeft } from '@/shared/ui/DatePicker/DatePickerIcon/ArrowLeft'
import { ArrowRight } from '@/shared/ui/DatePicker/DatePickerIcon/ArrowRight'
import { Calendar } from '@/shared/ui/DatePicker/DatePickerIcon/Calendar'

import s from './DatePicker.module.scss'

type CommonDatePickerProps = {
  label?: string
  error?: string
  disabled?: boolean
  placeholder?: string
}

export type DatePickerProps =
  | (CommonDatePickerProps & {
      mode: 'single'
      value?: Date
      onChange: (date?: Date) => void
      locale: Locale
    })
  | (CommonDatePickerProps & {
      mode: 'range'
      value?: DateRange
      onChange: (range?: DateRange) => void
      locale: Locale
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

const dayPickerClassNames = {
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
  ...dayPickerClassNames,
  range_start: s.rangeStart,
  range_middle: s.rangeMiddle,
  range_end: s.rangeEnd,
}

export const DatePicker = (props: DatePickerProps) => {
  const [isOpen, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const triggerId = useId()
  const errorId = `${triggerId}-error`

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node

      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const isPopoverOpen = isOpen && !props.error

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
        onClick={() => setOpen(prev => !prev)}
        type="button"
        className={`${s.trigger} ${props.error ? s.triggerError : ''}`}
        disabled={props.disabled}
        aria-expanded={isPopoverOpen}
        aria-haspopup="dialog"
        aria-describedby={props.error ? errorId : undefined}
      >
        <span>{inputValue || props.placeholder || 'Date select'}</span>
        <Calendar />
      </button>

      {isPopoverOpen &&
        (props.mode === 'single' ? (
          <div className={s.popover}>
            <DayPicker
              locale={props.locale}
              mode="single"
              selected={props.value}
              onSelect={props.onChange}
              components={dayPickerComponents}
              classNames={dayPickerClassNames}
              modifiers={{ weekend: { dayOfWeek: [0, 6] } }}
              modifiersClassNames={{ weekend: s.weekend }}
            />
          </div>
        ) : (
          <div className={s.popover}>
            <DayPicker
              locale={props.locale}
              mode="range"
              selected={props.value}
              onSelect={props.onChange}
              components={dayPickerComponents}
              classNames={rangeClassNames}
              modifiers={{ weekend: { dayOfWeek: [0, 6] } }}
              modifiersClassNames={{ weekend: s.weekend }}
            />
          </div>
        ))}

      {props.error && (
        <span id={errorId} className={s.error}>
          {props.error}
        </span>
      )}
    </div>
  )
}
