import type { Meta, StoryObj } from '@storybook/react';
import Alert from '@meowkit/components/alert';

const meta: Meta<typeof Alert> = {
  title: 'Primitives/Alert',
  component: Alert,
  args: {
    type: 'info',
    header: 'Device connected',
    children: 'Serial port COM3 is ready.',
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {};
export const Success: Story = {
  args: {
    type: 'success',
    header: 'Flash complete',
    children: 'Firmware written successfully.',
  },
};
export const Warning: Story = {
  args: {
    type: 'warning',
    header: 'Low battery',
    children: 'Charge the device before flashing.',
  },
};
export const Error: Story = {
  args: {
    type: 'error',
    header: 'Flash failed',
    children: 'Could not open the port.',
  },
};
export const Dismissible: Story = {
  args: {
    dismissible: true,
    onDismiss: () => undefined,
  },
};
export const WithAction: Story = {
  args: {
    type: 'error',
    header: 'Flash failed',
    children: 'Could not open the port.',
    action: <button type="button">Retry</button>,
  },
};
