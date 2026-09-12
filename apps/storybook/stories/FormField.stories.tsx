import type { Meta, StoryObj } from '@storybook/react';
import FormField from '@meowkit/components/form-field';
import Input from '@meowkit/components/input';

const meta: Meta<typeof FormField> = {
  title: 'Primitives/FormField',
  component: FormField,
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'Device name',
    htmlFor: 'device-name',
    children: <Input id="device-name" aria-label="Device name" placeholder="Enter a name" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Port',
    htmlFor: 'port',
    errorText: 'Required',
    children: <Input id="port" invalid defaultValue="" aria-label="Port" />,
  },
};
