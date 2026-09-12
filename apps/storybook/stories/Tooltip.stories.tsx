import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';
import Tooltip from '@meowkit/components/tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  args: {
    content: 'COM3 is open',
    children: <Button>Port</Button>,
    side: 'top',
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};
export const Top: Story = { args: { side: 'top' } };
export const Right: Story = { args: { side: 'right' } };
export const Bottom: Story = { args: { side: 'bottom' } };
export const Left: Story = { args: { side: 'left' } };
