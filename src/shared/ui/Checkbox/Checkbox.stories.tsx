import type {Meta, StoryObj} from '@storybook/nextjs-vite'
import {CheckBox} from '@/shared/ui/Checkbox'
import React from "react";

const meta: Meta<typeof CheckBox> = {
    title: 'Shared/UI/Checkbox',
    component: CheckBox,

    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'inctagram-dark',
            values: [
                {
                    name: 'inctagram-dark',
                    value: '#0d0d0d',
                },
            ],
        },
    },
    decorators: [
        Story => (
            <div style={{backgroundColor: '#0d0d0d', padding: '24px'}}>
                <Story/>
            </div>
        ),
    ],
    args: {
        label: 'Check-box',
        size: 'md',
    },
    argTypes: {
        className: {
            control: false,
        },
        size: {
            control: {type: 'inline-radio'},
            options: ['sm', 'md', 'lg'],
        },
    },
} satisfies Meta<typeof CheckBox>

export default meta

type Story = StoryObj<typeof CheckBox>

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
        checked: true,
    },
}

export const Disabled: Story = {
    args: {
        label: 'Disabled checkbox',
        disabled: true,
    },
}

export const DisabledChecked: Story = {
    args: {
        label: 'Disabled checkbox',
        disabled: true,
        checked: true
    },
}

export const Error: Story = {
    args: {
        label: 'Checkbox with error',
        error: true,
    },
}

export const ControlledCheckbox: StoryObj<typeof CheckBox> = {
    render: () => {
        const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(false)
        return (
            <CheckBox
                label="ControlledCheckbox"
                checked={checked}
                onCheckedChange={setChecked}
            />
        )
    },
}

export const Sizes: Story = {
    render: () => (
        <div style={{display: 'flex', gap: 20}}>
            <CheckBox size="sm" label="Small"/>
            <CheckBox size="md" label="Medium"/>
            <CheckBox size="lg" label="Large"/>
        </div>
    ),
}
