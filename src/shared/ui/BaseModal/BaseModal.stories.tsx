import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { Button } from '../Button'
import { BaseModal, ModalBody, ModalClose, ModalFooter, ModalHeader, ModalTitle } from './BaseModal'

const demoStyles = {
  modal: {
    background: 'var(--dark-300)',
    borderRadius: '2px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderBottom: '1px solid var(--dark-100)',
  },
  title: {
    margin: 0,
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'var(--font-weight-semibold)',
    lineHeight: 'var(--line-height-l)',
  },
  body: {
    padding: '20px',
  },
  footer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    padding: '0 20px 20px',
  },
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
      story: { inline: false, iframeHeight: 500 },
    },
    backgrounds: {
      default: 'inctagram-dark',
      values: [{ name: 'inctagram-dark', value: '#0d0d0d' }],
    },
  },
  args: {
    open: true,
    closeOnOverlay: true,
    onOpenChange: fn(),
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether modal is rendered.',
    },
    closeOnOverlay: {
      control: 'boolean',
      description: 'Close modal when clicking outside modal body.',
    },
    onOpenChange: {
      action: 'closed',
      description: 'Called on close button, Escape key, or overlay click with `false`.',
    },
  },
}

export default meta
type Story = StoryObj<typeof BaseModal>

// Infrastructure styles live in BaseModal; each concrete modal owns its visuals.
// Stories emulate a real modal look with local style props.
export const Default: Story = {
  args: {
    open: true,
    closeOnOverlay: true,
  },
  render: args => (
    <BaseModal {...args} style={demoStyles.modal}>
      <ModalHeader style={demoStyles.header}>
        <ModalTitle style={demoStyles.title}>Email sent</ModalTitle>
        <ModalClose style={demoStyles.close} />
      </ModalHeader>
      <ModalBody style={demoStyles.body}>
        We have sent a link to confirm your email address.
      </ModalBody>
    </BaseModal>
  ),
}

export const WithFooter: Story = {
  args: {
    open: true,
  },
  render: args => (
    <BaseModal {...args} style={demoStyles.modal}>
      <ModalHeader style={demoStyles.header}>
        <ModalTitle style={demoStyles.title}>Delete post?</ModalTitle>
        <ModalClose style={demoStyles.close} />
      </ModalHeader>
      <ModalBody style={demoStyles.body}>This action cannot be undone.</ModalBody>
      <ModalFooter style={demoStyles.footer}>
        <Button variant="default" type="button">
          Cancel
        </Button>
        <Button variant="primary" type="button">
          Delete
        </Button>
      </ModalFooter>
    </BaseModal>
  ),
}

export const CustomClose: Story = {
  args: {
    open: true,
  },
  render: args => (
    <BaseModal {...args} style={demoStyles.modal}>
      <ModalHeader style={demoStyles.header}>
        <ModalTitle style={demoStyles.title}>Custom close</ModalTitle>
        <ModalClose style={demoStyles.close}>Close</ModalClose>
      </ModalHeader>
      <ModalBody style={demoStyles.body}>Close button renders custom content.</ModalBody>
    </BaseModal>
  ),
}

export const WithoutTitle: Story = {
  args: {
    open: true,
  },
  render: args => (
    <BaseModal {...args} style={demoStyles.modal}>
      <ModalHeader style={demoStyles.header}>
        <ModalClose style={demoStyles.close} />
      </ModalHeader>
      <ModalBody style={demoStyles.body}>Header works without title.</ModalBody>
    </BaseModal>
  ),
}

export const NoOverlayClose: Story = {
  args: {
    closeOnOverlay: false,
    open: true,
  },
  render: args => (
    <BaseModal {...args} style={demoStyles.modal}>
      <ModalHeader style={demoStyles.header}>
        <ModalTitle style={demoStyles.title}>Static overlay</ModalTitle>
        <ModalClose style={demoStyles.close} />
      </ModalHeader>
      <ModalBody style={demoStyles.body}>Click outside does not close this modal.</ModalBody>
    </BaseModal>
  ),
}
