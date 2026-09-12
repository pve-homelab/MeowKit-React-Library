import type { Meta, StoryObj } from '@storybook/react';
import Box from '@meowkit/components/box';
import SpaceBetween from '@meowkit/components/space-between';

const meta: Meta<typeof SpaceBetween> = {
  title: 'Layout/SpaceBetween',
  component: SpaceBetween,
  args: {
    direction: 'vertical',
    size: 'm',
    children: (
      <>
        <Box padding={2} color="text">
          First
        </Box>
        <Box padding={2} color="muted">
          Second
        </Box>
        <Box padding={2} color="text">
          Third
        </Box>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof SpaceBetween>;

export const Vertical: Story = {};
export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    size: 's',
  },
};
export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};
