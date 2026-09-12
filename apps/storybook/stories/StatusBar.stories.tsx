import type { Meta, StoryObj } from '@storybook/react';
import StatusBar from '@meowkit/components/status-bar';

const meta: Meta<typeof StatusBar> = {
  title: 'Layout/StatusBar',
  component: StatusBar,
  args: {
    children: 'Ready',
  },
};

export default meta;
type Story = StoryObj<typeof StatusBar>;

export const Default: Story = {};
export const WithSlots: Story = {
  args: {
    left: 'Ln 12, Col 4',
    children: 'Connected',
    right: 'UTF-8',
  },
};
