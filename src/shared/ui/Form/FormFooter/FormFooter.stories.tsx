import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormFooter } from './FormFooter'
import { Button } from '@/shared/ui/Button'

const meta = {
  title: 'Shared/Ui/Form/FormFooter',
  component: FormFooter,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FormFooter>

export default meta
type Story = StoryObj<typeof meta>

/** Additional content after a main action in the form. */
export const Fields: Story = {
  args: {
    children: (
      <>
        <p>Dont have an account?</p>
        <Button asChild={true}>
          <a href="#">Sign Up</a>
        </Button>
      </>
    ),
  },
}
