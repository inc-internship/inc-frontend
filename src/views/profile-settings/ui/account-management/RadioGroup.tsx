import { ChangeEvent } from 'react'

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
    onValueChange(event.target.value as TValue)
  }

  return (
    <fieldset className={s.fieldset}>
      <legend className={s.sectionTitle}>{legend}</legend>

      <div className={s.panel}>
        {options.map(option => (
          <label className={s.radioOption} key={option.value}>
            <input
              checked={value === option.value}
              className={s.radioInput}
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
