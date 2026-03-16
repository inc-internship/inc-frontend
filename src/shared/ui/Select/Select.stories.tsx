import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Select, type SelectOption } from './Select'

const dot = (color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><circle cx='8' cy='8' r='7' fill='${color}'/></svg>`,
  )}`

const frameworkOptions: SelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'disabled', label: 'Disabled option', disabled: true },
]

const languageOptions: SelectOption[] = [
  { value: 'en', label: 'English', iconSrc: dot('#d32f2f') },
  { value: 'de', label: 'German', iconSrc: dot('#f2c94c') },
  { value: 'ru', label: 'Russian', iconSrc: dot('#0b5bd3') },
]

const meta = {
  title: 'Shared/UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'inctagram-dark',
      values: [{ name: 'inctagram-dark', value: '#0d0d0d' }],
    },
  },
  decorators: [
    Story => (
      <div style={{ width: 260, padding: 24, backgroundColor: '#0d0d0d' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    options: frameworkOptions,
    placeholder: 'Select framework',
    variant: 'outlined',
    disabled: false,
    label: '',
    name: 'select',
    value: null,
    onChange: () => {},
  },
  argTypes: {
    className: { control: false },
    onChange: { control: false },
    options: { control: false },
    value: { control: false },
    variant: { control: { type: 'inline-radio' }, options: ['outlined', 'ghost'] },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = (args: Story['args']) => {
  const [value, setValue] = useState<string | null>(null)

  return (
    <Select
      {...args}
      options={args?.options ?? frameworkOptions}
      value={value}
      onChange={setValue}
    />
  )
}

export const Playground: Story = {
  args: {},
  render: args => <Controlled {...args} />,
}

export const WithLabel: Story = {
  args: {
    label: 'Framework',
  },
  render: args => <Controlled {...args} />,
}

export const WithIcons: Story = {
  args: {
    label: 'Language',
    placeholder: 'Choose language',
    options: languageOptions,
  },
  render: args => <Controlled {...args} />,
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Framework',
  },
  render: args => <Controlled {...args} />,
}

export const GhostVariant: Story = {
  args: {
    label: 'Framework',
    variant: 'ghost',
  },
  render: args => <Controlled {...args} />,
}
