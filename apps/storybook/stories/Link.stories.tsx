import type { Meta, StoryObj } from '@storybook/react';
import Link from '@meowkit/components/link';

const meta: Meta<typeof Link> = {
  title: 'Primitives/Link',
  component: Link,
  args: {
    children: 'Read the docs',
    href: 'https://meowkit.cc',
    variant: 'primary',
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
