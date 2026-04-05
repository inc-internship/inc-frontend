import clsx from 'clsx'
import styles from './Spinner.module.scss'

type SpinnerProps = {
  size?: 'sm' | 'md'
  className?: string
}

export const Spinner = ({ size = 'sm', className }: SpinnerProps) => {
  return <span className={clsx(styles.spinner, styles[size], className)} aria-hidden="true" />
}
