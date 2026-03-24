import { AuthLayout } from '@/widgets/auth-layout'
import { Button } from '@/shared/ui/Button'
import authGirlImage from '../../../../public/images/auth/auth-girl.svg'
import s from './ConfirmedEmail.module.scss'

export const ConfirmedEmail = () => {
  return (
    <AuthLayout
      title={'Congratulations!'}
      text={'Your email has been confirmed'}
      imageSrc={authGirlImage}
      imageAlt={''}
      childrenClassName={s.confirmedChildren}
      imageWrapperClassName={s.confirmedImageWrapper}
    >
      <Button asChild variant="primary" className={s.button}>
        <a href="/sign-in">Sign In</a>
      </Button>
    </AuthLayout>
  )
}
