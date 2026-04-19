import s from './ExpandedPanel.module.scss'
import { Slider } from './Slider/Slider'

type Props = {
  id: string
  value: number
  onChange: (value: number) => void
}

export const ExpandedPanel = ({ id, value, onChange }: Props) => (
  <div className={s.wrapper}>
    <Slider id={id} value={value} onChange={onChange} />
  </div>
)
