import clsx from 'clsx'
import { ImageOutlineIcon } from '@/shared/ui/icons/ImageOutlineIcon'
import type { AspectRatioOption } from './ExpandedPanel'
import s from './ExpandedPanel.module.scss'

type Props = {
  option: AspectRatioOption
  isSelected: boolean
  onSelect: (value: string) => void
}

export const AspectRatioOptionItem = ({ option, isSelected, onSelect }: Props) => (
  <li role="presentation">
    <button
      type="button"
      className={clsx(s.option, isSelected && s.optionSelected)}
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(option.value)}
    >
      <span className={s.label}>{option.label}</span>
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
