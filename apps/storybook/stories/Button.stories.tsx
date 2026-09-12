import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  args: {
    children: 'Continue',
    variant: 'primary',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } };
export const Icon: Story = { args: { variant: 'icon', 'aria-label': 'Close', children: '×' } };
