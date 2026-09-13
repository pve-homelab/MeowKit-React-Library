import type { Meta, StoryObj } from '@storybook/react';
import StorageManagerView from '@meowkit/components/storage-manager-view';

const entries = [
  { id: 'lib', name: 'lib', type: 'folder' as const },
  { id: 'main', name: 'main.py', type: 'file' as const, size: 128 },
  { id: 'boot', name: 'boot.py', type: 'file' as const, size: 64 },
];

const meta: Meta<typeof StorageManagerView> = {
  title: 'Patterns/StorageManagerView',
  component: StorageManagerView,
  args: {
    entries,
    path: '/CIRCUITPY',
    status: 'idle',
    onNavigate: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof StorageManagerView>;

export const Idle: Story = {};
export const WithActions: Story = {
  args: {
    onUpload: () => undefined,
    onDelete: () => undefined,
    onRefresh: () => undefined,
  },
};
export const Busy: Story = {
  args: {
    status: 'busy',
    onUpload: () => undefined,
    onDelete: () => undefined,
    onRefresh: () => undefined,
  },
};
export const Error: Story = {
  args: {
    status: 'error',
    onRefresh: () => undefined,
  },
};
export const Empty: Story = {
  args: {
    entries: [],
    path: '/CIRCUITPY/empty',
  },
};
