import type { Meta, StoryObj } from '@storybook/react';
import DeviceManagerPanel from '@meowkit/components/device-manager-panel';

const devices = [
  { id: 'uno', name: 'Arduino UNO', status: 'disconnected' as const },
  { id: 'pico', name: 'Pico W', status: 'connected' as const },
  { id: 'esp', name: 'ESP32', status: 'busy' as const },
];

const meta: Meta<typeof DeviceManagerPanel> = {
  title: 'Patterns/DeviceManagerPanel',
  component: DeviceManagerPanel,
  args: {
    devices,
    selectedId: 'pico',
    status: 'idle',
    onSelect: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof DeviceManagerPanel>;

export const Idle: Story = {};
export const WithActions: Story = {
  args: {
    selectedId: 'uno',
    onConnect: () => undefined,
    onDisconnect: () => undefined,
    onRefresh: () => undefined,
  },
};
export const Busy: Story = {
  args: {
    status: 'busy',
    onConnect: () => undefined,
    onDisconnect: () => undefined,
    onRefresh: () => undefined,
  },
};
export const Error: Story = {
  args: {
    status: 'error',
    errorMessage: 'Port busy',
    onRefresh: () => undefined,
  },
};
export const Empty: Story = {
  args: {
    devices: [],
    selectedId: undefined,
  },
};
