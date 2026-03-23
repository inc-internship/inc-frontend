import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormFields } from './FormFields'
import { Input } from '@/shared/ui/Input'

const meta = {
  title: 'Shared/Ui/Form/FormFields',
  component: FormFields,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FormFields>

export default meta
type Story = StoryObj<typeof meta>

/** Groups form fields into a single vertical section with consistent spacing. */
export const Fields: Story = {
  args: {
    children: (
      <>
        <Input type="email" label="Email" placeholder="Epam@epam.com" />
        <Input type="password" label="Password" placeholder="******" />
      </>
    ),
  },
}
