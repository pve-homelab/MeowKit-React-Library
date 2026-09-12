import type { Meta, StoryObj } from '@storybook/react';
import KeyValuePairs from '@meowkit/components/key-value-pairs';

const meta: Meta<typeof KeyValuePairs> = {
  title: 'Patterns/KeyValuePairs',
  component: KeyValuePairs,
  args: {
    items: [
      { label: 'Name', value: 'Companion' },
      { label: 'Status', value: 'Connected' },
      { label: 'Port', value: 'COM3' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof KeyValuePairs>;

export const Default: Story = {};
export const TwoColumns: Story = {
  args: {
    columns: 2,
  },
};
export const ThreeColumns: Story = {
  args: {
    columns: 3,
    items: [
      { label: 'Name', value: 'Companion' },
      { label: 'Status', value: 'Connected' },
      { label: 'Port', value: 'COM3' },
      { label: 'Baud', value: '115200' },
      { label: 'Chip', value: 'ESP32' },
      { label: 'Firmware', value: '1.4.2' },
    ],
  },
};
