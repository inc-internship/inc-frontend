import { Form, FormActions, FormFields, FormFooter } from '@/shared/ui/Form'
import { Typography } from '@/shared/ui/Typography'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { Input } from '@/shared/ui/Input'
import { FormSocials } from '@/shared/ui/FormSocials'
import { CheckBox } from '@/shared/ui/CheckBox'
import s from './SignUpForm.module.scss'

export const SignUpForm = () => {
  return (
    <div className={s.formWrapper}>
      <Form className={s.form}>
        <Typography className={s.title} variant="h1">
          Sign Up
        </Typography>
        <FormSocials />
        <FormFields className={s.formFields}>
          <Input
            className={s.inputField}
            name="UserName"
            type="text"
            label="UserName"
            placeholder="Epam11"
          />
          <Input
            className={s.inputField}
            name="email"
            type="email"
            label="Email"
            placeholder="Epam@epam.com"
          />
          <Input
            className={s.inputField}
            name="password"
            type="password"
            label="Password"
            placeholder="******************"
          />
          <Input
            className={s.inputField}
            name="passwordConfirm"
            type="password"
            label="Password confirmation"
            placeholder="******************"
          />
          <div className={s.checkboxRow}>
            <CheckBox id="terms" name="terms" size="lg" />
            <Typography variant="text-s" as="label" htmlFor="terms" className={s.checkboxLabel}>
              I agree to the{' '}
              <Link className={s.checkBoxLink} href="/terms-of-service">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link className={s.checkBoxLink} href="/privacy-policy">
                Privacy Policy
              </Link>
            </Typography>
          </div>
        </FormFields>
        <FormActions className={s.actions}>
          <Button className={s.submitButton} variant="primary" type="submit">
            Sign Up
          </Button>
        </FormActions>
        <FormFooter className={s.footer}>
          <p className={s.footerInfo}>Do you have an account?</p>
          <Button variant={'default'} className={s.footerBtn} type={'button'} asChild={true}>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </FormFooter>
      </Form>
    </div>
  )
}
