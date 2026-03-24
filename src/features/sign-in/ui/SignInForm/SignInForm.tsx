import { Form, FormActions, FormAssist, FormFields, FormFooter } from '@/shared/ui/Form'
import { FormSocials } from '@/shared/ui/FormSocials'
import { Typography } from '@/shared/ui/Typography'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import s from './SignInForm.module.scss'

export const SignInForm = () => {
  return (
    <section className={s.section}>
      <div className={s.card}>
        <Form className={s.form}>
          <Typography className={s.title} variant="h1">
            Sign In
          </Typography>
          <div className={s.socials}>
            <FormSocials />
          </div>

          <FormFields className={s.fields}>
            <Input type="email" label="Email" placeholder="Epam@epam.com" />
            <Input type="password" label="Password" placeholder="**********" />
          </FormFields>
          <FormAssist align="right" className={s.assist}>
            <Typography as={Link} variant="link-m" href="/forgot-password">
              Forgot Password
            </Typography>
          </FormAssist>
          <FormActions className={s.actions}>
            <Button className={s.submitButton} variant="primary" type="submit">
              Sign In
            </Button>
          </FormActions>
          <FormFooter className={s.footer}>
            <Typography className={s.footerText} variant="text-l">
              Don&apos;t have an account?
            </Typography>
            <Button className={s.signUpButton} asChild={true}>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </FormFooter>
        </Form>
      </div>
    </section>
  )
}
