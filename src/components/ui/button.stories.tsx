import type { Meta, StoryObj } from '@storybook/react';
import { Loader2 } from 'lucide-react';
import { Button } from './button';

const meta = {
	title: 'UI/Button',
	component: Button,
	decorators: [
		Story => (
			<div className="flex h-full w-full items-center justify-center pt-8">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: 'Button',
	},
	argTypes: {
		variant: {
			name: 'Variants',
			control: { type: 'select' },
			options: ['default', 'outline', 'ghost', 'link', 'icon'],
		},
		size: {
			name: 'Sizes',
			control: { type: 'select' },
			options: ['default', 'xs', 'sm', 'lg', 'icon'],
		},
		disabled: { name: 'Disabled', control: 'boolean' },
	},
};

export const Loading: Story = {
	args: {
		children: <Loader2 className="animate-spin" strokeWidth={3} />,
		disabled: true,
	},
	render: args => <Button className="w-20" {...args} />,
};
