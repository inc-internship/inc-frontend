import { CSSProperties } from 'react'
import s from './Slider.module.scss'

type Props = {
  id: string
  value: number
  onChange: (value: number) => void
}

export const Slider = ({ id, value, onChange }: Props) => {
  return (
    <div className={s.wrapper}>
      <input
        id={id}
        aria-label="Zoom level"
        className={s.slider}
        type="range"
        min={0}
        max={100}
        step={10}
        value={value}
        onChange={event => onChange(Number(event.target.value))}
        style={{ '--slider-progress': `${value}%` } as CSSProperties}
      />
    </div>
  )
}
