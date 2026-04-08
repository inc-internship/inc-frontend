import { Spinner } from './Spinner'
import s from './PageSpinner.module.scss'

export const PageSpinner = () => {
  return (
    <div className={s.root}>
      <Spinner size="lg" />
    </div>
  )
}
