import { Statistics } from './Statistics/Statistics'
import s from './ProfileStatistics.module.scss'
import { useI18n } from '@/shared/i18n'

export const ProfileStatistics = () => {
  const { t } = useI18n()

  return (
    <section className={s.container}>
      <Statistics number={2218} title={t('profile.following')} />
      <Statistics number={2358} title={t('profile.followers')} />
      <Statistics number={2764} title={t('profile.publications')} />
    </section>
  )
}
