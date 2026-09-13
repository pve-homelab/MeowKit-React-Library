import type { Meta, StoryObj } from '@storybook/react';
import FirmwareFlashingPanel from '@meowkit/components/firmware-flashing-panel';

const meta: Meta<typeof FirmwareFlashingPanel> = {
  title: 'Patterns/FirmwareFlashingPanel',
  component: FirmwareFlashingPanel,
  args: {
    deviceName: 'Pico W',
    status: 'idle',
    progress: 0,
    onConnect: () => undefined,
    onFlash: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof FirmwareFlashingPanel>;

export const Idle: Story = {};
export const ConfirmErase: Story = {
  args: {
    confirmErase: false,
    onConfirmEraseChange: () => undefined,
  },
};
export const Busy: Story = {
  args: {
    status: 'busy',
    progress: 42,
    onCancel: () => undefined,
  },
};
export const Success: Story = {
  args: {
    status: 'success',
    progress: 100,
    confirmErase: true,
  },
};
export const Error: Story = {
  args: {
    status: 'error',
    errorMessage: 'Flash failed',
    onCancel: () => undefined,
  },
};
export const NoDevice: Story = {
  args: {
    deviceName: undefined,
  },
};
