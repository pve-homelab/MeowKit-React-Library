import type { Meta, StoryObj } from '@storybook/react';
import Slider from '@meowkit/components/slider';

const meta: Meta<typeof Slider> = {
  title: 'Primitives/Slider',
  component: Slider,
  args: {
    'aria-label': 'Volume',
    defaultValue: [40],
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {};
export const WithLabel: Story = { args: { children: 'Volume', 'aria-label': undefined } };
export const Stepped: Story = { args: { min: 0, max: 100, step: 10, defaultValue: [50] } };
export const Range: Story = { args: { defaultValue: [20, 80], 'aria-label': 'Price range' } };
export const Disabled: Story = { args: { disabled: true } };
