import * as Checkbox from '@radix-ui/react-checkbox'
export type CheckboxSize = 'sm' | 'md' | 'lg'
export type CheckboxVariant = 'default' | 'error'

export interface Props extends Checkbox.CheckboxProps {
  label?: string
  size?: CheckboxSize
  variant?: CheckboxVariant
  error?: boolean
}
