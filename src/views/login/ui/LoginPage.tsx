import { LoginForm } from '@/features/login'
import { FormSocials } from '@/shared/ui/FormSocials'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'
import { Typography } from '@/shared/ui/Typography'
import { Card } from '@/shared/ui/Card'

export const LoginPage = () => (
  <Card>
    <Typography variant="h1" align="center">
      Sign in
    </Typography>
    <FormSocials />
    <LoginForm />
    <Typography variant="text-l" align="center">
      Don&#39;t have an account?
    </Typography>
    <Button asChild={true} fullWidth={true}>
      <Link href="/register">Sign Up</Link>
    </Button>
  </Card>
)
