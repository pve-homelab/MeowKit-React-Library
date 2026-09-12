import type { Meta, StoryObj } from '@storybook/react';
import SegmentedControl from '@meowkit/components/segmented-control';

const options = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'table', label: 'Table', disabled: true },
];

const meta: Meta<typeof SegmentedControl> = {
  title: 'Primitives/SegmentedControl',
  component: SegmentedControl,
  args: {
    options,
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: 'list' } };
export const Disabled: Story = {};
