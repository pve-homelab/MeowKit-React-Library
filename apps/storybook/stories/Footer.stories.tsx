import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';
import Footer from '@meowkit/components/footer';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  args: {
    children: <Button variant="primary">Save</Button>,
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
export const MultipleActions: Story = {
  args: {
    children: (
      <>
        <Button>Cancel</Button>
        <Button variant="primary">Save</Button>
      </>
    ),
  },
};
