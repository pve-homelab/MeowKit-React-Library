import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';
import Toolbar from '@meowkit/components/toolbar';

const meta: Meta<typeof Toolbar> = {
  title: 'Layout/Toolbar',
  component: Toolbar,
  args: {
    children: 'Editor',
  },
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {};
export const WithSlots: Story = {
  args: {
    left: <Button variant="ghost">Menu</Button>,
    children: 'serial-monitor.ts',
    right: <Button>Share</Button>,
  },
};
