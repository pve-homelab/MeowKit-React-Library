import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';
import Header from '@meowkit/components/header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  args: {
    children: 'Resources',
    variant: 'h2',
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};
export const WithDescription: Story = {
  args: {
    description: 'Manage devices connected to this workspace.',
  },
};
export const WithActionsAndCounter: Story = {
  args: {
    variant: 'h1',
    counter: '(12)',
    actions: <Button>Create</Button>,
    description: 'All items in the current project.',
  },
};
