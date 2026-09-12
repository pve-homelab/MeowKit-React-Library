import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from '@meowkit/components/breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Layout/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { text: 'Home', href: '#' },
      { text: 'Projects', href: '#' },
      { text: 'MeowKit' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};
export const WithOnClick: Story = {
  args: {
    items: [
      { text: 'Workspace', onClick: () => undefined },
      { text: 'Devices', onClick: () => undefined },
      { text: 'COM3' },
    ],
  },
};
