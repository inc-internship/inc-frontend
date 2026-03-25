import { Form, FormActions, FormFields } from '@/shared/ui/Form'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import s from './VerificationLinkExpiredForm.module.scss'

export const VerificationLinkExpiredForm = () => (
  <Form>
    <div className={s.formInner}>
      <FormFields>
        <Input type={'email'} label={'Email'} placeholder={'Epam@epam.com'} />
      </FormFields>
      <FormActions>
        <Button variant="primary">Resend verification link</Button>
      </FormActions>
    </div>
  </Form>
)
