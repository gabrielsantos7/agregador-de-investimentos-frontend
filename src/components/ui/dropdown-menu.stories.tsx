import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './dropdown-menu';

const meta = {
	title: 'UI/DropdownMenu',
	component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Playground: Story = {
	args: {
		children: (
			<>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">
						Fruit
						<span className="sr-only">Change fruits</span>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuItem>Apple</DropdownMenuItem>
					<DropdownMenuItem>Pineapple</DropdownMenuItem>
					<DropdownMenuItem>Orange</DropdownMenuItem>
          <DropdownMenuItem>Strawberry</DropdownMenuItem>
				</DropdownMenuContent>
			</>
		),
	},
};
