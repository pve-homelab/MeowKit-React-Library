import type { Meta, StoryObj } from '@storybook/react';
import NumberInput from '@meowkit/components/number-input';

const meta: Meta<typeof NumberInput> = {
  title: 'Primitives/NumberInput',
  component: NumberInput,
  args: {
    'aria-label': 'Port',
    defaultValue: 8080,
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true, defaultValue: -1 } };
export const Disabled: Story = { args: { disabled: true } };
export const Steppable: Story = { args: { step: 1, min: 0, max: 100, defaultValue: 4 } };
