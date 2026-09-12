import type { Meta, StoryObj } from '@storybook/react';
import Box from '@meowkit/components/box';

const meta: Meta<typeof Box> = {
  title: 'Layout/Box',
  component: Box,
  args: {
    children: 'Box content',
    padding: 3,
    color: 'text',
    fontSize: 'md',
    fontWeight: 'regular',
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {};
export const Muted: Story = {
  args: {
    color: 'muted',
    fontSize: 'sm',
    children: 'Secondary copy',
  },
};
export const Heading: Story = {
  args: {
    as: 'h2',
    fontSize: 'xl',
    fontWeight: 'bold',
    padding: 'none',
    children: 'Section title',
  },
};
