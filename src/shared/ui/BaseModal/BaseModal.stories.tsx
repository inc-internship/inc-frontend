import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '../Button'
import { BaseModal } from './BaseModal'
import { ModalBody } from './ModalBody'
import { ModalClose } from './ModalClose'
import { ModalDescription } from './ModalDescription'
import { ModalFooter } from './ModalFooter'
import { ModalHeader } from './ModalHeader'
import { ModalTitle } from './ModalTitle'

const demoStyles = {
  modal: {
    background: 'var(--dark-300)',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    borderBottom: '1px solid var(--dark-100)',
  },
  title: {
    margin: 0,
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'var(--font-weight-semibold)',
    lineHeight: 'var(--line-height-l)',
  },
  description: { marginTop: 4, fontSize: 'var(--font-size-sm)', color: 'var(--light-400)' },
  body: { padding: 20 },
  footer: { display: 'flex', gap: 12, justifyContent: 'flex-end', padding: '0 20px 20px' },
  close: {
    marginLeft: 'auto',
    border: 0,
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--light-100)',
  },
}

const meta: Meta<typeof BaseModal> = {
  title: 'Shared/UI/BaseModal',
  component: BaseModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'BaseModal — a universal modal component using Radix Dialog. ' +
          'Use child components: ModalHeader, ModalBody, ModalFooter, ModalTitle, ModalDescription, ModalClose.',
      },
    },
    backgrounds: {
      default: 'inctagram-dark',
      values: [{ name: 'inctagram-dark', value: '#0d0d0d' }],
    },
  },
  args: { open: true, closeOnOverlay: true, size: 'md' },
  argTypes: {
    open: { control: 'boolean', description: 'Controls modal visibility' },
    closeOnOverlay: { control: 'boolean', description: 'Close modal when clicking on the overlay' },
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Select modal size',
    },
    onOpenChange: {
      action: 'changed',
      description: 'Called when modal open state changes',
    },
    children: {
      description: 'Child elements of the modal (ModalHeader, ModalBody, ModalFooter)',
      control: false,
    },
    className: { description: 'CSS class for modal', control: false },
    overlayClassName: { description: 'CSS class for overlay', control: false },
  },
}

export default meta
type Story = StoryObj<typeof BaseModal>

export const Default: Story = {
  render: args => (
    <BaseModal {...args} style={demoStyles.modal}>
      <ModalHeader style={demoStyles.header}>
        <ModalTitle style={demoStyles.title}>Email sent</ModalTitle>
        <ModalDescription style={demoStyles.description}>
          We have sent a link to confirm your email address.
        </ModalDescription>
        <ModalClose style={demoStyles.close} />
      </ModalHeader>
      <ModalBody style={demoStyles.body}>
        You can close this modal by pressing the button or Escape key.
      </ModalBody>
    </BaseModal>
  ),
  parameters: {
    docs: { description: { story: 'Basic modal with title, description, and close button.' } },
  },
}

export const WithFooter: Story = {
  args: {
    open: false,
  },

  render: args => (
    <BaseModal {...args} style={demoStyles.modal}>
      <ModalHeader style={demoStyles.header}>
        <ModalTitle style={demoStyles.title}>Delete post?</ModalTitle>
        <ModalClose style={demoStyles.close} />
      </ModalHeader>
      <ModalBody style={demoStyles.body}>This action cannot be undone.</ModalBody>
      <ModalFooter style={demoStyles.footer}>
        <Button variant="default">Cancel</Button>
        <Button variant="primary">Delete</Button>
      </ModalFooter>
    </BaseModal>
  ),

  parameters: {
    docs: { description: { story: 'Modal with footer and Cancel/Delete buttons.' } },
  },
}

export const CustomClose: Story = {
  render: args => (
    <BaseModal {...args} style={demoStyles.modal}>
      <ModalHeader style={demoStyles.header}>
        <ModalTitle style={demoStyles.title}>Custom close</ModalTitle>
        <ModalClose style={demoStyles.close}>Close</ModalClose>
      </ModalHeader>
      <ModalBody style={demoStyles.body}>Close button renders custom content.</ModalBody>
    </BaseModal>
  ),
  parameters: {
    docs: { description: { story: 'Close button with custom content.' } },
  },
}

export const WithoutTitle: Story = {
  render: args => (
    <BaseModal {...args} style={demoStyles.modal}>
      <ModalHeader style={demoStyles.header}>
        <ModalClose style={demoStyles.close} />
      </ModalHeader>
      <ModalBody style={demoStyles.body}>Header works without a title.</ModalBody>
    </BaseModal>
  ),
  parameters: {
    docs: { description: { story: 'Modal without a title in the header.' } },
  },
}

export const NoOverlayClose: Story = {
  render: args => (
    <BaseModal {...args} style={demoStyles.modal} closeOnOverlay={false}>
      <ModalHeader style={demoStyles.header}>
        <ModalTitle style={demoStyles.title}>Static overlay</ModalTitle>
        <ModalClose style={demoStyles.close} />
      </ModalHeader>
      <ModalBody style={demoStyles.body}>Clicking outside does not close this modal.</ModalBody>
    </BaseModal>
  ),
  parameters: {
    docs: { description: { story: 'Modal with overlay that does not close on click outside.' } },
  },
}
