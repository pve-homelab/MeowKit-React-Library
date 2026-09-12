import type { Meta, StoryObj } from '@storybook/react';
import Sidebar from '@meowkit/components/sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  args: {
    children: 'Devices, workspaces, and settings.',
    width: 240,
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};
export const WithHeader: Story = {
  args: {
    header: 'Workspace',
  },
};
export const Collapsible: Story = {
  args: {
    header: 'Workspace',
    collapsible: true,
  },
};
