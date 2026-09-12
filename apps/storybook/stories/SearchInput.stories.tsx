import type { Meta, StoryObj } from '@storybook/react';
import SearchInput from '@meowkit/components/search-input';

const meta: Meta<typeof SearchInput> = {
  title: 'Primitives/SearchInput',
  component: SearchInput,
  args: {
    'aria-label': 'Search devices',
    placeholder: 'Search',
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {};
export const WithClear: Story = {
  args: {
    defaultValue: 'meowkit',
    onClear: () => {},
  },
};
export const Invalid: Story = { args: { invalid: true, defaultValue: '?' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'kit' } };
