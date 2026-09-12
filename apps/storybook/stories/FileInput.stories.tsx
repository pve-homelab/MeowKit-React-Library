import type { Meta, StoryObj } from '@storybook/react';
import FileInput from '@meowkit/components/file-input';

const meta: Meta<typeof FileInput> = {
  title: 'Primitives/FileInput',
  component: FileInput,
};

export default meta;
type Story = StoryObj<typeof FileInput>;

export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true, buttonText: 'Choose files' } };
export const AcceptBinaries: Story = { args: { accept: '.bin,.hex' } };
export const Disabled: Story = { args: { disabled: true } };
