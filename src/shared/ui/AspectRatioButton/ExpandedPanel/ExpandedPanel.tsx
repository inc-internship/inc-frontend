import { AspectRatioOptionItem } from './AspectRatioOptionItem'
import s from './ExpandedPanel.module.scss'

export type AspectRatioPreview = 'image' | 'square' | 'portrait' | 'landscape'

export type AspectRatioOption = {
  value: string
  label: string
  preview: AspectRatioPreview
}

type Props = {
  id: string
  options: AspectRatioOption[]
  value: string
  onChange: (value: string) => void
}

export const DEFAULT_ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  { value: 'original', label: 'Original', preview: 'image' },
  { value: '1:1', label: '1:1', preview: 'square' },
  { value: '4:5', label: '4:5', preview: 'portrait' },
  { value: '16:9', label: '16:9', preview: 'landscape' },
]

export const ExpandedPanel = ({ id, options, value, onChange }: Props) => (
  <div className={s.wrapper}>
    <ul id={id} className={s.list} role="listbox" aria-label="Aspect ratio options">
      {options.map(option => (
        <AspectRatioOptionItem
          key={option.value}
          option={option}
          isSelected={option.value === value}
          onSelect={onChange}
        />
      ))}
    </ul>
  </div>
)
