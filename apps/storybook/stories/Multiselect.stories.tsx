import type { Meta, StoryObj } from '@storybook/react';
import Multiselect from '@meowkit/components/multiselect';

const options = [
  { value: 'esp32', label: 'ESP32' },
  { value: 'pico', label: 'Pico' },
  { value: 'stm32', label: 'STM32', disabled: true },
];

const meta: Meta<typeof Multiselect> = {
  title: 'Primitives/Multiselect',
  component: Multiselect,
  args: {
    options,
    placeholder: 'Choose boards',
    'aria-label': 'Boards',
  },
};

export default meta;
type Story = StoryObj<typeof Multiselect>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: ['esp32', 'pico'] } };
export const TokenLimit: Story = { args: { defaultValue: ['esp32', 'pico'], tokenLimit: 1 } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: ['pico'] } };
