import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { BaseModal } from './BaseModal'

const meta: Meta<typeof BaseModal> = {
  title: 'Shared/UI/BaseModal',
  component: BaseModal,
  tags: ['autodocs'],
  parameters: {
    // Keep dialog centered and visible on dark canvas.
    layout: 'centered',
    docs: {
      story: { inline: false, iframeHeight: 500 },
    },
    backgrounds: {
      default: 'inctagram-dark',
      values: [{ name: 'inctagram-dark', value: '#0d0d0d' }],
    },
  },
  args: {
    // Base story args that match current BaseModal props.
    isOpen: true,
    title: 'Email sent',
    closeOnOverlay: true,
    onClose: fn(),
    children: 'We have sent a link to confirm your email address.',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether modal is rendered.',
    },
    title: {
      control: 'text',
      description: 'Optional title rendered in header.',
    },
    children: {
      control: 'text',
      description: 'Main modal content.',
    },
    closeOnOverlay: {
      control: 'boolean',
      description: 'Close modal when clicking outside modal body.',
    },
    closeIconSrc: {
      control: 'text',
      description: 'Optional icon source for close button. Falls back to "X".',
    },
    onClose: {
      action: 'closed',
      description: 'Called on close button, Escape key, or overlay click.',
    },
  },
}

export default meta
type Story = StoryObj<typeof BaseModal>

// Default state with title, text content, and fallback "X" close icon.
export const Default: Story = {
  args: {
    isOpen: true,
    closeOnOverlay: false,
    closeIconSrc: '',
  },
}

// Demonstrates a custom image icon for the close button.
export const WithCloseIcon: Story = {
  args: {
    closeIconSrc: '/icons/ui/close-outline.svg',
  },
}

// Header without title; close button should stay aligned to the right.
export const WithoutTitle: Story = {
  args: {
    title: undefined,
  },
}

// Prevents closing the modal on overlay click.
export const NoOverlayClose: Story = {
  args: {
    closeOnOverlay: false,
  },
}
