import type { Meta, StoryObj } from '@storybook/react';
import Tabs from '@meowkit/components/tabs';

const tabs = [
  { id: 'overview', label: 'Overview', content: 'Overview panel' },
  { id: 'logs', label: 'Logs', content: 'Logs panel' },
  { id: 'settings', label: 'Settings', content: 'Settings panel', disabled: true },
];

const meta: Meta<typeof Tabs> = {
  title: 'Primitives/Tabs',
  component: Tabs,
  args: {
    tabs,
    defaultActiveTabId: 'overview',
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultActiveTabId: 'logs' } };
export const Disabled: Story = {};
