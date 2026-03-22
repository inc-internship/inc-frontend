import s from './CongratulationsPage.module.scss'
import { AuthLayout } from '@/widgets/auth-layout'

export const CongratulationsPage = () => {
  return <AuthLayout title={'Congratulations!'} subtitle={'Your email has been confirmed'} />
}
