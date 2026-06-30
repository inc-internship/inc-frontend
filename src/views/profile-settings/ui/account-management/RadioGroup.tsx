import { ChangeEvent } from 'react'
import clsx from 'clsx'

import type { RadioOption } from './accountManagement.types'
import s from './AccountManagementPage.module.scss'

type Props<TValue extends string> = {
  legend: string
  name: string
  options: Array<RadioOption<TValue>>
  value: TValue
  onValueChange: (value: TValue) => void
}

export function RadioGroup<TValue extends string>({
  legend,
  name,
  options,
  value,
  onValueChange,
}: Props<TValue>) {
  const valueChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value
    const nextOption = options.find(option => option.value === nextValue)

    if (nextOption) {
      onValueChange(nextOption.value)
    }
  }

  return (
    <fieldset className={s.fieldset}>
      {/* fieldset/legend keeps the radio group accessible without additional aria wiring. */}
      <legend className={s.sectionTitle}>{legend}</legend>

      <div className={s.panel}>
        {options.map(option => (
          <label
            className={clsx(s.radioOption, option.disabled && s.radioOptionDisabled)}
            key={option.value}
          >
            <input
              checked={value === option.value}
              className={s.radioInput}
              disabled={option.disabled}
              name={name}
              type="radio"
              value={option.value}
              onChange={valueChangeHandler}
            />
            <span className={s.radioControl} aria-hidden="true" />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
