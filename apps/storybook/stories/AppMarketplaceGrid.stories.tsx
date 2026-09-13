import type { Meta, StoryObj } from '@storybook/react';
import AppMarketplaceGrid from '@meowkit/components/app-marketplace-grid';

const apps = [
  {
    id: 'blink',
    name: 'Blink',
    description: 'Flash the onboard LED',
    icon: '💡',
    installed: false,
  },
  {
    id: 'serial',
    name: 'Serial Monitor',
    description: 'Read device output',
    icon: '📟',
    installed: true,
  },
  {
    id: 'files',
    name: 'File Manager',
    description: 'Browse device storage',
    icon: '📁',
    installed: false,
  },
];

const meta: Meta<typeof AppMarketplaceGrid> = {
  title: 'Patterns/AppMarketplaceGrid',
  component: AppMarketplaceGrid,
  args: {
    apps,
    columns: 3,
  },
};

export default meta;
type Story = StoryObj<typeof AppMarketplaceGrid>;

export const Catalog: Story = {};
export const WithActions: Story = {
  args: {
    onInstall: () => undefined,
    onOpen: () => undefined,
  },
};
export const TwoColumns: Story = {
  args: {
    columns: 2,
    onInstall: () => undefined,
    onOpen: () => undefined,
  },
};
export const Empty: Story = {
  args: {
    apps: [],
  },
};
