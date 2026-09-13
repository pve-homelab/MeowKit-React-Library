import type { Meta, StoryObj } from '@storybook/react';
import FormField from '@meowkit/components/form-field';
import Input from '@meowkit/components/input';
import Multiselect from '@meowkit/components/multiselect';

const meta: Meta<typeof FormField> = {
  title: 'Primitives/FormField',
  component: FormField,
  parameters: {
    docs: {
      description: {
        component:
          'When FormField has a single child element, it clones that child and sets `aria-describedby` to the description and error ids. Multiple children are left unchanged — pass `aria-describedby` yourself in that case. Multiselect forwards the injected id onto its combobox.',
      },
    },
  },
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

export const WithMultiselect: Story = {
  args: {
    label: 'Boards',
    description: 'Pick one or more development boards.',
    errorText: 'Select at least one board.',
    children: (
      <Multiselect
        options={[
          { value: 'esp32', label: 'ESP32' },
          { value: 'pico', label: 'Pico' },
          { value: 'stm32', label: 'STM32', disabled: true },
        ]}
        placeholder="Choose boards"
        aria-label="Boards"
        invalid
      />
    ),
  },
};
