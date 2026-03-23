import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { JSX } from 'react'
import { FormActions } from './FormActions'
import { Button } from '@/shared/ui/Button'

const withWidth = (Story: () => JSX.Element) => (
  <div style={{ width: '320px', padding: '8px', border: '1px solid gray' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Shared/Ui/Form/FormActions',
  component: FormActions,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FormActions>

export default meta
type Story = StoryObj<typeof meta>

/** Main action content in Form. */
export const Content: Story = {
  args: {
    children: <Button variant="primary">Sign in</Button>,
  },
  decorators: [withWidth],
}
