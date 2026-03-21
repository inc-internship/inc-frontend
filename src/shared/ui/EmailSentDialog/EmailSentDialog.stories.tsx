import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { EmailSentDialog } from './EmailSentDialog'

const meta: Meta<typeof EmailSentDialog> = {
  title: 'Shared/UI/EmailSentDialog',
  component: EmailSentDialog,
  tags: ['autodocs'],
  parameters: {
    // Render it as a centered modal in the Storybook canvas.
    layout: 'centered',
    backgrounds: {
      default: 'inctagram-dark',
      values: [{ name: 'inctagram-dark', value: '#0d0d0d' }],
    },
  },
  args: {
    // Default values shared by all stories.
    title: 'Email sent',
    email: 'epam@epam.com',
    confirmText: 'OK',
    onClose: fn(),
    onConfirm: fn(),
  },
  argTypes: {
    className: {
      control: false,
      description: 'Additional class for the root container.',
    },
    title: {
      control: 'text',
      description: 'Dialog title text.',
    },
    email: {
      control: 'text',
      description: 'Email value used in the default description.',
    },
    description: {
      control: 'text',
      description: 'Custom description. Replaces the default fallback text.',
    },
    confirmText: {
      control: 'text',
      description: 'Confirm button label.',
    },
    onClose: {
      action: 'closed',
      description: 'Triggered when the close icon is clicked.',
    },
    onConfirm: {
      action: 'confirmed',
      description: 'Triggered when the OK button is clicked.',
    },
  },
}

export default meta
type Story = StoryObj<typeof EmailSentDialog>

// Basic state with fallback description.
export const Default: Story = {}

// Example with custom title/description/button label.
export const CustomText: Story = {
  args: {
    title: 'Password recovery',
    description: 'Check your mailbox and follow the recovery link.',
    confirmText: 'Got it',
  },
}

// Scenario without email to verify fallback text behavior.
export const WithoutEmail: Story = {
  args: {
    email: undefined,
  },
}
