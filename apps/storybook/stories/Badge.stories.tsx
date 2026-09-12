import type { Meta, StoryObj } from '@storybook/react';
import Badge from '@meowkit/components/badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  args: {
    children: 'New',
    color: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const Accent: Story = { args: { color: 'accent', children: 'Lime' } };
export const Success: Story = { args: { color: 'success', children: 'Ready' } };
export const Warning: Story = { args: { color: 'warning', children: 'Low battery' } };
export const Error: Story = { args: { color: 'error', children: 'Failed' } };
export const Info: Story = { args: { color: 'info', children: 'Beta' } };
