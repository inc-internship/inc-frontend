import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Select, type SelectOption } from './Select'

// Base options for common Select scenarios in stories.
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

// Demonstrates icon support via icon paths from /public.
const languageOptionsWithIcons: SelectOption[] = [
  { value: 'en', label: 'English', iconSrc: '/icons/flags/flag-united-kingdom.svg' },
  { value: 'ru', label: 'Russian', iconSrc: '/icons/flags/flag-russia.svg' },
  { value: 'de', label: 'German', iconSrc: '/icons/payments/stripe.svg' },
]

const meta = {
  title: 'Shared/UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Controlled Select component with keyboard support, optional label, two visual variants, disabled state, and optional icons in options.',
      },
    },
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
    options: {
      control: false,
      description: 'Array of options displayed in the dropdown list.',
      table: { category: 'Props' },
    },
    value: {
      control: 'text',
      description: 'Currently selected option value. Use null for empty state.',
      table: { category: 'Props' },
    },
    onChange: {
      control: false,
      description: 'Callback called with selected value when user picks an option.',
      table: { category: 'Events' },
    },
    placeholder: {
      control: 'text',
      description: 'Text shown when no value is selected.',
      table: { category: 'Props' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables opening the dropdown and selecting options.',
      table: { category: 'Props' },
    },
    label: {
      control: 'text',
      description: 'Optional field label displayed above the trigger button.',
      table: { category: 'Props' },
    },
    name: {
      control: 'text',
      description: 'Optional HTML name attribute for the trigger button.',
      table: { category: 'Props' },
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ['outlined', 'ghost'],
      description: 'Visual style of the component.',
      table: { category: 'Appearance' },
    },
    className: {
      control: false,
      description: 'Additional class for custom styling from parent.',
      table: { category: 'Props' },
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

// Story helper to keep Select controlled and interactive in Storybook.
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
  parameters: {
    docs: {
      description: {
        story: 'Interactive sandbox to test the main Select behavior and props.',
      },
    },
  },
  args: {
    value: null,
  },
  render: args => <Controlled {...args} />,
}

export const WithLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Example with top label, useful in forms with multiple fields.',
      },
    },
  },
  args: {
    label: 'Framework',
  },
  render: args => <Controlled {...args} />,
}

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Options with icons (for countries, payment systems, or categories).',
      },
    },
  },
  args: {
    label: 'Language',
    placeholder: 'Choose language',
    options: languageOptionsWithIcons,
    value: 'en',
  },
  render: args => <Controlled {...args} />,
}

export const Numbers: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Compact numeric options, including disabled option state.',
      },
    },
  },
  args: {
    label: 'Amount',
    placeholder: 'Choose number',
    options: numberOptions,
  },
  render: args => <Controlled {...args} />,
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled Select: cannot open, cannot change value.',
      },
    },
  },
  args: {
    disabled: true,
    label: 'Framework',
  },
  render: args => <Controlled {...args} />,
}

export const GhostVariant: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Ghost visual variant with transparent trigger background.',
      },
    },
  },
  args: {
    label: 'Framework',
    variant: 'ghost',
  },
  render: args => <Controlled {...args} />,
}
