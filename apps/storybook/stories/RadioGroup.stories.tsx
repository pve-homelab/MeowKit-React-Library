import type { Meta, StoryObj } from '@storybook/react';
import RadioGroup from '@meowkit/components/radio-group';

const items = [
  { value: 'usb', label: 'USB' },
  { value: 'serial', label: 'Serial' },
  { value: 'wifi', label: 'Wi-Fi', disabled: true },
];

const meta: Meta<typeof RadioGroup> = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  args: {
    items,
    name: 'connection',
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: 'usb' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'serial' } };
