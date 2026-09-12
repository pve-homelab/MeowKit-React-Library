import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';
import Popover from '@meowkit/components/popover';

const meta: Meta<typeof Popover> = {
  title: 'Primitives/Popover',
  component: Popover,
  args: {
    content: 'Port COM3 is open. Firmware 1.4.2 is installed.',
    children: <Button>Details</Button>,
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {};

export const DefaultOpen: Story = {
  args: { defaultOpen: true },
};

export const ControlledOpen: Story = {
  args: { open: true },
};
