import type { Meta, StoryObj } from '@storybook/react';
import Box from '@meowkit/components/box';
import Grid from '@meowkit/components/grid';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  args: {
    gridDefinition: [{ colspan: 4 }, { colspan: 8 }],
    children: (
      <>
        <Box padding={3} color="text">
          colspan 4
        </Box>
        <Box padding={3} color="muted">
          colspan 8
        </Box>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Definition: Story = {};
export const EqualColumns: Story = {
  args: {
    gridDefinition: undefined,
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
export const NoGutters: Story = {
  args: {
    disableGutters: true,
  },
};
