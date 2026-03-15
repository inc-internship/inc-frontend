import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
    title: 'UI/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        disabled: {
            control: 'boolean',
        },
        error: {
            control: 'boolean',
        },
    },
}

export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
    args: {
        label: 'Checkbox',
        size: 'md',
        disabled: false,
    },
}

export const Checked: Story = {
    args: {
        label: 'Checked checkbox',
        defaultChecked: true,
    },
}

export const Disabled: Story = {
    args: {
        label: 'Disabled checkbox',
        disabled: true,
    },
}

export const Error: Story = {
    args: {
        label: 'Checkbox with error',
        error: true,
    },
}

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 20 }}>
            <Checkbox size="sm" label="Small" />
            <Checkbox size="md" label="Medium" />
            <Checkbox size="lg" label="Large" />
        </div>
    ),
}