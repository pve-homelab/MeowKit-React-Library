import type { Meta, StoryObj } from '@storybook/react';
import SerialConsoleView from '@meowkit/components/serial-console-view';

const lines = [
  { id: '1', text: 'Connected to COM3 at 115200', stream: 'system' as const },
  { id: '2', text: '>>> print("hello")', stream: 'stdout' as const },
  { id: '3', text: 'hello', stream: 'stdout' as const },
  { id: '4', text: 'Traceback (most recent call last):', stream: 'stderr' as const },
];

const meta: Meta<typeof SerialConsoleView> = {
  title: 'Patterns/SerialConsoleView',
  component: SerialConsoleView,
  args: {
    lines,
    connected: true,
    onSend: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof SerialConsoleView>;

export const Connected: Story = {};
export const Disconnected: Story = {
  args: {
    connected: false,
    lines: [{ id: '1', text: 'Port closed', stream: 'system' }],
  },
};
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
export const WithClear: Story = {
  args: {
    onClear: () => undefined,
  },
};
export const Empty: Story = {
  args: {
    lines: [],
  },
};
