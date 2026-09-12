import type { Meta, StoryObj } from '@storybook/react';
import Icon, { ICON_NAMES } from '@meowkit/components/icon';

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  args: {
    name: 'add',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Icon name="search" size="sm" />
      <Icon name="search" size="md" />
      <Icon name="search" size="lg" />
    </div>
  ),
};

export const StarterSet: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, color: 'var(--mk-color-text)' }}>
      {ICON_NAMES.map((name) => (
        <span key={name} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 88 }}>
          <Icon name={name} size="lg" />
          <span style={{ fontSize: 12 }}>{name}</span>
        </span>
      ))}
    </div>
  ),
};

export const CurrentColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, color: 'var(--mk-color-primary)' }}>
      <Icon name="check" size="lg" />
      <Icon name="warning" size="lg" />
      <Icon name="usb" size="lg" />
    </div>
  ),
};

export const Accessible: Story = {
  args: {
    name: 'settings',
    'aria-label': 'Settings',
  },
};
