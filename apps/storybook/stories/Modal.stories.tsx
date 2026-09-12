import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';
import Modal, { type ModalProps } from '@meowkit/components/modal';
import { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Primitives/Modal',
  component: Modal,
  args: {
    visible: true,
    header: 'Erase flash',
    children: 'This cannot be undone. The device memory will be wiped.',
    size: 'md',
    onDismiss: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function ModalDemo(args: ModalProps) {
  const [visible, setVisible] = useState(args.visible);
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open modal</Button>
      <Modal
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
  render: (args) => <ModalDemo {...args} />,
};

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => <ModalDemo {...args} />,
};

export const Large: Story = {
  args: { size: 'lg' },
  render: (args) => <ModalDemo {...args} />,
};

export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="destructive">Erase</Button>
      </>
    ),
  },
  render: (args) => <ModalDemo {...args} />,
};
