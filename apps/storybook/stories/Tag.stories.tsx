import type { Meta, StoryObj } from '@storybook/react';
import Tag from '@meowkit/components/tag';

const meta: Meta<typeof Tag> = {
  title: 'Primitives/Tag',
  component: Tag,
  args: {
    children: 'serial',
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {};
export const Dismissible: Story = {
  args: {
    onDismiss: () => undefined,
    dismissLabel: 'Remove filter',
  },
};
