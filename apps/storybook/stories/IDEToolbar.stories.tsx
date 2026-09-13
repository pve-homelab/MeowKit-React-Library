import type { Meta, StoryObj } from '@storybook/react';
import IDEToolbar from '@meowkit/components/ide-toolbar';

const meta: Meta<typeof IDEToolbar> = {
  title: 'Patterns/IDEToolbar',
  component: IDEToolbar,
  args: {
    children: 'main.ino',
    left: 'MeowKit IDE',
    right: 'UNO R4',
  },
};

export default meta;
type Story = StoryObj<typeof IDEToolbar>;

export const Default: Story = {};
export const Busy: Story = {
  args: {
    busy: true,
  },
};
export const WithActions: Story = {
  args: {
    onSave: () => undefined,
    onBuild: () => undefined,
    onFlash: () => undefined,
    onRun: () => undefined,
  },
};
