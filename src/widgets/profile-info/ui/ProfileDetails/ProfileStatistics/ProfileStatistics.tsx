import { Statistics } from './Statistics/Statistics'
import s from './ProfileStatistics.module.scss'

export const ProfileStatistics = () => {
  return (
    <section className={s.container}>
      <Statistics number={2218} title="Following" />
      <Statistics number={2358} title="Followers" />
      <Statistics number={2764} title="Publications" />
    </section>
  )
}
