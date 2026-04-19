'use client'

import { CSSProperties } from 'react'
import s from './Slider.module.scss'
import { useI18n } from '@/shared/i18n'

type Props = {
  id: string
  value: number
  onChange: (value: number) => void
}

export const Slider = ({ id, value, onChange }: Props) => {
  const { t } = useI18n()

  return (
    <div className={s.wrapper}>
      <input
        id={id}
        aria-label={t('common.zoomLevel')}
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
