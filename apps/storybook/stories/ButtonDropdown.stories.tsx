import type { Meta, StoryObj } from '@storybook/react';
import ButtonDropdown from '@meowkit/components/button-dropdown';

const items = [
  { id: 'flash', text: 'Flash firmware' },
  { id: 'erase', text: 'Erase flash', destructive: true },
  { id: 'lock', text: 'Lock', disabled: true },
];

const meta: Meta<typeof ButtonDropdown> = {
  title: 'Primitives/ButtonDropdown',
  component: ButtonDropdown,
  args: {
    items,
    children: 'Actions',
  },
};

export default meta;
type Story = StoryObj<typeof ButtonDropdown>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Disabled: Story = { args: { disabled: true } };
