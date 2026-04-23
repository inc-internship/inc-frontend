'use client'

import clsx from 'clsx'
import { ImageOutlineIcon } from '@/shared/ui/icons/ImageOutlineIcon'
import type { AspectRatioOption } from './ExpandedPanel'
import s from './ExpandedPanel.module.scss'
import { useI18n } from '@/shared/i18n'

type Props = {
  option: AspectRatioOption
  isSelected: boolean
  onSelect: (value: string) => void
}

export const AspectRatioOptionItem = ({ option, isSelected, onSelect }: Props) => {
  const { t } = useI18n()

  return (
    <li role="presentation">
      <button
        type="button"
        className={clsx(s.option, isSelected && s.optionSelected)}
        role="option"
        aria-selected={isSelected}
        onClick={() => onSelect(option.value)}
      >
        <span className={s.label}>{t(option.label)}</span>
        <span className={s.preview} aria-hidden>
          {option.preview === 'image' ? (
            <ImageOutlineIcon />
          ) : (
            <span className={clsx(s.frame, s[`frame_${option.preview}`])} />
          )}
        </span>
      </button>
    </li>
  )
}
