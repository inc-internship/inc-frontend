'use client'

import { format } from 'date-fns'
import s from './DatePicker.module.scss'
import { type DateRange, DayPicker } from 'react-day-picker'

export type DatePickerProps =
  | {
      mode: 'single'
      value?: Date
      onChange: (date?: Date) => void
      label?: string
      error?: string
      disabled?: boolean
    }
  | {
      mode: 'range'
      value?: DateRange
      onChange: (range?: DateRange) => void
      label?: string
      error?: string
      disabled?: boolean
    }

export const DatePicker = (props: DatePickerProps) => {
  const inputValue =
    props.mode === 'single'
      ? props.value
        ? format(props.value, 'dd/MM/yyyy')
        : ''
      : props.value?.from && props.value?.to
        ? `${format(props.value.from, 'dd/MM/yyyy')} - ${format(props.value.to, 'dd/MM/yyyy')}`
        : ''

  return (
    <div className={s.root}>
      {props.label && <label className={s.label}>{props.label}</label>}

      <button type="button" className={s.trigger} disabled={props.disabled}>
        {inputValue || 'Date select'}
        <span className={s.icon}>📅</span>
      </button>

      <div className={s.popover}>
        {props.mode === 'single' ? (
          <DayPicker
            mode="single"
            selected={props.value}
            onSelect={props.onChange}
            modifiers={{ weekend: { dayOfWeek: [0, 6] } }}
            modifiersClassNames={{ weekend: s.weekend }}
            classNames={{
              root: s.calendar,
              month_caption: s.caption,
              day: s.day,
              day_button: s.dayButton,
              selected: s.selected,
              today: s.today,
              disabled: s.disabledDay,
              outside: s.outside,
            }}
          />
        ) : (
          <DayPicker
            mode="range"
            selected={props.value}
            onSelect={props.onChange}
            modifiers={{ weekend: { dayOfWeek: [0, 6] } }}
            modifiersClassNames={{ weekend: s.weekend }}
            classNames={{
              root: s.calendar,
              month_caption: s.caption,
              day: s.day,
              day_button: s.dayButton,
              selected: s.selected,
              range_start: s.rangeStart,
              range_middle: s.rangeMiddle,
              range_end: s.rangeEnd,
              today: s.today,
              disabled: s.disabledDay,
              outside: s.outside,
            }}
          />
        )}
      </div>

      {props.error && <span className={s.error}>{props.error}</span>}
    </div>
  )
}
