import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from '@meowkit/components/progress-bar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
  args: {
    value: 40,
    max: 100,
    label: 'Flash',
    description: '40 of 100 blocks',
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};
export const Complete: Story = { args: { value: 100, description: '100 of 100 blocks' } };
export const CustomMax: Story = { args: { value: 8, max: 10, description: '8 of 10 blocks' } };
export const Unlabeled: Story = { args: { label: undefined, description: undefined } };
