import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { FormFields } from './FormFields/FormFields'
import { FormAssist } from './FormAssist/FormAssist'
import { FormActions } from './FormActions/FormActions'
import { FormFooter } from './FormFooter/FormFooter'
import { Form } from './Form'

const meta = {
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const BaseForm: Story = {
  args: {
    children: (
      <>
        <FormFields>
          <Input type="email" label="Email" placeholder="Epam@epam.com" />
          <Input type="password" label="Password" placeholder="******" />
        </FormFields>
        <FormAssist align="right">
          <a href="#">Forgot Password</a>
        </FormAssist>
        <FormActions>
          <Button variant="primary" type="submit">
            Sign in
          </Button>
        </FormActions>
        <FormFooter>
          <p>Dont have an account?</p>
          <Button asChild={true}>
            <a href="#">Sign Up</a>
          </Button>
        </FormFooter>
      </>
    ),
  },
}
