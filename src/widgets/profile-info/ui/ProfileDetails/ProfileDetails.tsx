import { ProfileHeader } from './ProfileHeader/ProfileHeader'
import s from './ProfileDetails.module.scss'
import { ProfileStatistics } from './ProfileStatistics/ProfileStatistics'
import { ProfileDescription } from './ProfileDescription/ProfileDescription'

export const ProfileDetails = () => (
  <section className={s.container}>
    <ProfileHeader />
    <ProfileStatistics />
    <ProfileDescription />
  </section>
)
