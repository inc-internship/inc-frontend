import { StatusWidget } from '@/widgets/status-widget'
import authBoyImage from '../../../../public/images/auth/auth-boy.svg'
import s from './VerificationLinkExpiredPage.module.scss'
import { VerificationLinkExpiredForm } from '@/features/verification-link-expired-form'

export const VerificationLinkExpiredPage = () => (
  <StatusWidget
    title="Email verification link expired"
    text="Looks like the verification link has expired. Not to worry, we can send the link again"
    imageSrc={authBoyImage}
    imageAlt="Email verification link expired"
    childrenClassName={s.expiredChildren}
    imageWrapperClassName={s.expiredImageWrapper}
  >
    <VerificationLinkExpiredForm />
  </StatusWidget>
)
