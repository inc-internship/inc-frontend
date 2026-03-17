import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Select, type SelectOption } from './Select'

const dot = (color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><circle cx='10' cy='10' r='8' fill='${color}'/></svg>`,
  )}`

const frameworkOptions: SelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte', disabled: true },
]

const numberOptions: SelectOption[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3', disabled: true },
]

const languageOptionsWithIcons: SelectOption[] = [
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
    label: undefined,
    name: 'select',
    value: null,
    onChange: () => {},
  },
  argTypes: {
    className: { control: false },
    onChange: { control: false },
    options: { control: false },
    value: {
      control: 'text',
      description: 'Initial selected value for the story render',
    },
    variant: { control: { type: 'inline-radio' }, options: ['outlined', 'ghost'] },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = (args: Story['args']) => {
  const [innerValue, setInnerValue] = useState<string | null>(null)
  const value = args?.value ?? innerValue
  const handleChange = (nextValue: string) => {
    setInnerValue(nextValue)
    args?.onChange?.(nextValue)
  }

  return (
    <Select
      {...args}
      options={args?.options ?? frameworkOptions}
      value={value}
      onChange={handleChange}
    />
  )
}

export const Playground: Story = {
  args: {
    value: null,
  },
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
    options: languageOptionsWithIcons,
    value: 'en',
  },
  render: args => <Controlled {...args} />,
}

export const Numbers: Story = {
  args: {
    label: 'Amount',
    placeholder: 'Choose number',
    options: numberOptions,
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
