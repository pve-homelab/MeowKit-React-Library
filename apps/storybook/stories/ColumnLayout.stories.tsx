import type { Meta, StoryObj } from '@storybook/react';
import Box from '@meowkit/components/box';
import ColumnLayout from '@meowkit/components/column-layout';

const meta: Meta<typeof ColumnLayout> = {
  title: 'Layout/ColumnLayout',
  component: ColumnLayout,
  args: {
    columns: 2,
    variant: 'default',
    children: (
      <>
        <Box padding={3} color="text">
          First column
        </Box>
        <Box padding={3} color="muted">
          Second column
        </Box>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof ColumnLayout>;

export const TwoColumns: Story = {};
export const ThreeColumns: Story = {
  args: {
    columns: 3,
    children: (
      <>
        <Box padding={3}>One</Box>
        <Box padding={3}>Two</Box>
        <Box padding={3}>Three</Box>
      </>
    ),
  },
};
export const TextGrid: Story = {
  args: {
    variant: 'text-grid',
    columns: 2,
    children: (
      <>
        <div>
          <strong>Name</strong>
          <div>Companion</div>
        </div>
        <div>
          <strong>Status</strong>
          <div>Connected</div>
        </div>
      </>
    ),
  },
};
