import clsx from 'clsx'
import s from './Spinner.module.scss'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Spinner = ({ size = 'sm', className }: SpinnerProps) => {
  return <span className={clsx(s.spinner, s[size], className)} aria-hidden="true" />
}
