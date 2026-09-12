import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from '@meowkit/components/checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  args: {
    children: 'Enable serial',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { indeterminate: true, children: 'Select all' } };
export const Disabled: Story = { args: { disabled: true } };
