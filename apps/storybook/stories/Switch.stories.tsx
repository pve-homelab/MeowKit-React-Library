import type { Meta, StoryObj } from '@storybook/react';
import Switch from '@meowkit/components/switch';

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  args: {
    'aria-label': 'Dark mode',
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const WithLabel: Story = { args: { children: 'Dark mode', 'aria-label': undefined } };
export const Disabled: Story = { args: { disabled: true } };
