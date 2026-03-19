import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EmailSentDialog } from './EmailSentDialog'

const meta: Meta<typeof EmailSentDialog> = {
  title: 'Shared/UI/EmailSentDialog',
  component: EmailSentDialog,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'inctagram-dark',
      values: [{ name: 'inctagram-dark', value: '#0d0d0d' }],
    },
  },
  args: {
    email: 'epam@epam.com',
  },
}

export default meta
type Story = StoryObj<typeof EmailSentDialog>

export const Default: Story = {}

export const CustomText: Story = {
  args: {
    title: 'Password recovery',
    description: 'Check your mailbox and follow the recovery link.',
    confirmText: 'Got it',
  },
}
