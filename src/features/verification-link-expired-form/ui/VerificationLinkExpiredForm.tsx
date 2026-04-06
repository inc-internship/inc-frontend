import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import s from './VerificationLinkExpiredForm.module.scss'

export const VerificationLinkExpiredForm = () => (
  <form className={s.formInner}>
    <Input type={'email'} label={'Email'} placeholder={'Epam@epam.com'} />
    <Button variant="primary">Resend verification link</Button>
  </form>
)
