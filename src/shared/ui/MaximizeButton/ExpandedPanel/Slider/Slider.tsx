import { CSSProperties, useState } from 'react'
import s from './Slider.module.scss'

export const Slider = () => {
  const [value, setValue] = useState(30)

  return (
    <div className={s.wrapper}>
      <input
        aria-label="Zoom level"
        className={s.slider}
        type="range"
        min={0}
        max={100}
        step={10}
        value={value}
        onChange={event => setValue(Number(event.target.value))}
        style={{ '--slider-progress': `${value}%` } as CSSProperties}
      />
    </div>
  )
}
