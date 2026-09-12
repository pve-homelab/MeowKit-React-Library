import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';
import Flashbar, { useFlashbar, type FlashbarItem, type FlashbarProps } from '@meowkit/components/flashbar';
import { useState } from 'react';

const defaultItems: FlashbarItem[] = [
  {
    id: 'flash-1',
    type: 'success',
    header: 'Flash complete',
    content: 'Firmware written successfully.',
    dismissible: true,
  },
];

const meta: Meta<typeof Flashbar> = {
  title: 'Primitives/Flashbar',
  component: Flashbar,
  args: {
    items: defaultItems,
    onDismiss: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof Flashbar>;

function DeclarativeDemo(args: FlashbarProps) {
  const [items, setItems] = useState(args.items);
  return (
    <Flashbar
      {...args}
      items={items}
      onDismiss={(id) => {
        setItems((current) => current.filter((item) => item.id !== id));
        args.onDismiss?.(id);
      }}
    />
  );
}

function ImperativeDemo() {
  const { add, clear } = useFlashbar();
  return (
    <>
      <Button
        onClick={() =>
          add({
            id: `toast-${Date.now()}`,
            type: 'info',
            header: 'Device connected',
            content: 'Serial port COM3 is ready.',
            dismissible: true,
          })
        }
      >
        Show toast
      </Button>{' '}
      <Button variant="secondary" onClick={() => clear()}>
        Clear
      </Button>
    </>
  );
}

export const Default: Story = {
  render: (args) => <DeclarativeDemo {...args} />,
};

export const Multiple: Story = {
  args: {
    items: [
      {
        id: 'flash-info',
        type: 'info',
        header: 'Device connected',
        content: 'Serial port COM3 is ready.',
        dismissible: true,
      },
      {
        id: 'flash-success',
        type: 'success',
        header: 'Flash complete',
        content: 'Firmware written successfully.',
        dismissible: true,
      },
      {
        id: 'flash-error',
        type: 'error',
        header: 'Flash failed',
        content: 'Could not open the port.',
        dismissible: true,
      },
    ],
  },
  render: (args) => <DeclarativeDemo {...args} />,
};

export const Dismissible: Story = {
  render: (args) => <DeclarativeDemo {...args} />,
};

export const Imperative: Story = {
  render: () => <ImperativeDemo />,
};
