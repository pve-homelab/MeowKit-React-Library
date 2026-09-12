import type { Meta, StoryObj } from '@storybook/react';
import Textarea from '@meowkit/components/textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Primitives/Textarea',
  component: Textarea,
  args: {
    'aria-label': 'Notes',
    placeholder: 'Write a note',
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true, defaultValue: 'Needs a value' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Read only notes' } };
