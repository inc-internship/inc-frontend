import { AuthLayout } from '@/widgets/auth-layout'
import { Button } from '@/shared/ui/Button'
import authBoyImage from '../../../../public/images/auth/auth-boy.svg'
import s from './ExpiredEmailVerification.module.scss'
import { ResendVerificationForm } from '@/widgets/ResendVerificationForm/ui/ResendVerificationForm'

export const ExpiredEmailVerification = () => {
  return (
    <AuthLayout
      title={'Email verification link expired'}
      text={
        'Looks like the verification link has expired. Not to worry, we can send the link again'
      }
      imageSrc={authBoyImage}
      imageAlt={''}
      childrenClassName={s.expiredChildren}
      imageWrapperClassName={s.expiredImageWrapper}
    >
      <ResendVerificationForm />
    </AuthLayout>
  )
}
