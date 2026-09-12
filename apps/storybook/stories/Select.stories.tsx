import type { Meta, StoryObj } from '@storybook/react';
import Select from '@meowkit/components/select';

const options = [
  { value: 'usb', label: 'USB' },
  { value: 'serial', label: 'Serial' },
  { value: 'wifi', label: 'Wi-Fi', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  args: {
    options,
    placeholder: 'Choose connection',
    'aria-label': 'Connection',
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: 'usb' } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'serial' } };
