import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Shared/UI/Input',
  component: Input,
  args: {
    placeholder: 'Enter  text...',
  },
}

export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    label: 'Username',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Username',
    disabled: true,
  },
}

export const Error: Story = {
  args: {
    label: 'Username',
    error: 'Invalid value',
  },
}

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    onSearch: () => alert('Search clicked'),
  },
}

export const SearchDisabled: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    disabled: true,
  },
}

export const SearchWithError: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    error: 'Error',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
    label: 'Password',
  },
}

export const PasswordWithError: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
    label: 'Password',
    error: 'Password must be at least 8 characters',
  },
}

export const PasswordDisabled: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
    label: 'Password',
    disabled: true,
  },
}

export const Previews: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <Input label="Email" />
      <Input label="Email" disabled />
      <Input label="Email" error="Password must be at least 8 characters" />
      <Input type="search" />
      <Input type="search" disabled />
      <Input type="search" error="Error" />
      <Input label="Password" type="password" />
      <Input label="Password" type="password" disabled />
      <Input label="Password" type="password" error="Password must be at least 8 characters" />
    </div>
  ),
}
