import type { Meta, StoryObj } from '@storybook/react';
import Input from '@meowkit/components/input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  args: {
    'aria-label': 'Device name',
    placeholder: 'Enter a name',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true, defaultValue: 'bad' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Locked' } };
