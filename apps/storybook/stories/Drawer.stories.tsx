import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';
import Drawer, { type DrawerProps } from '@meowkit/components/drawer';
import { useState } from 'react';

const meta: Meta<typeof Drawer> = {
  title: 'Primitives/Drawer',
  component: Drawer,
  args: {
    visible: true,
    header: 'Device details',
    children: 'Port COM3 is open. Firmware 1.4.2 is installed.',
    position: 'right',
    onDismiss: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

function DrawerDemo(args: DrawerProps) {
  const [visible, setVisible] = useState(args.visible);
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open drawer</Button>
      <Drawer
        {...args}
        visible={visible}
        onDismiss={() => {
          setVisible(false);
          args.onDismiss();
        }}
      />
    </>
  );
}

export const Default: Story = {
  render: (args) => <DrawerDemo {...args} />,
};

export const Left: Story = {
  args: { position: 'left' },
  render: (args) => <DrawerDemo {...args} />,
};

export const Right: Story = {
  args: { position: 'right' },
  render: (args) => <DrawerDemo {...args} />,
};
