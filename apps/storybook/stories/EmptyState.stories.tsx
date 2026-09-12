import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';
import EmptyState from '@meowkit/components/empty-state';
import Icon from '@meowkit/components/icon';

const meta: Meta<typeof EmptyState> = {
  title: 'Patterns/EmptyState',
  component: EmptyState,
  args: {
    title: 'No devices',
    description: 'Connect a board to start flashing firmware.',
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};
export const WithAction: Story = {
  args: {
    action: <Button>Scan ports</Button>,
  },
};
export const WithIcon: Story = {
  args: {
    title: 'No files',
    description: 'Upload a sketch to get started.',
    icon: <Icon name="folder" size="lg" />,
    action: <Button>Upload</Button>,
  },
};
