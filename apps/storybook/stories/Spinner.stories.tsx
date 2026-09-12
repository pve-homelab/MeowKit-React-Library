import type { Meta, StoryObj } from '@storybook/react';
import Spinner from '@meowkit/components/spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  args: {
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const CustomLabel: Story = { args: { 'aria-label': 'Flashing firmware' } };
