import { Form, FormActions, FormAssist, FormFields, FormFooter } from '@/shared/ui/Form'
import { FormSocials } from '@/shared/ui/FormSocials'
import { Typography } from '@/shared/ui/Typography'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'

export const SignInForm = () => {
  return (
    <Form>
      <Typography variant="large">Sign In</Typography>
      <FormSocials />

      <FormFields>
        <Input type="email" label="Email" placeholder="Epam@epam.com" />
        <Input type="password" label="Password" placeholder="**********" />
      </FormFields>
      <FormAssist align="right">
        <Typography as={Link} variant="link-m" href="/forgot-password">
          Forgot Password
        </Typography>
      </FormAssist>
      <FormActions>
        <Button variant="primary" type="submit">
          Sign in
        </Button>
      </FormActions>
      <FormFooter>
        <p>Dont have an account?</p>
        <Button asChild={true}>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </FormFooter>
    </Form>
  )
}
