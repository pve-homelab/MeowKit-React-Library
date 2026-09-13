import type { Meta, StoryObj } from '@storybook/react';
import BuildOutputPanel from '@meowkit/components/build-output-panel';

const lines = [
  'Compiling sketch...',
  'Sketch uses 1234 bytes (4%) of program storage space.',
  'Done.',
];

const meta: Meta<typeof BuildOutputPanel> = {
  title: 'Patterns/BuildOutputPanel',
  component: BuildOutputPanel,
  args: {
    lines,
    status: 'idle',
  },
};

export default meta;
type Story = StoryObj<typeof BuildOutputPanel>;

export const Idle: Story = {};
export const Busy: Story = {
  args: {
    status: 'busy',
    lines: ['Compiling sketch...'],
  },
};
export const Success: Story = {
  args: {
    status: 'success',
    onClear: () => undefined,
  },
};
export const Error: Story = {
  args: {
    status: 'error',
    lines: ['Compiling sketch...', 'error: expected ";" before "}" token'],
    onClear: () => undefined,
  },
};
export const Empty: Story = {
  args: {
    lines: [],
  },
};
