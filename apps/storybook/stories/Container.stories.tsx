import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';
import Container from '@meowkit/components/container';
import Footer from '@meowkit/components/footer';
import Header from '@meowkit/components/header';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  args: {
    children: 'Container body',
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {};
export const WithHeaderAndFooter: Story = {
  args: {
    header: (
      <Header variant="h2" description="Optional supporting copy" counter="(3)" actions={<Button>Edit</Button>}>
        Panel title
      </Header>
    ),
    footer: (
      <Footer>
        <Button>Cancel</Button>
        <Button variant="primary">Apply</Button>
      </Footer>
    ),
    children: 'Padded content inside a bordered surface panel.',
  },
};
export const FlushContent: Story = {
  args: {
    disableContentPaddings: true,
    header: <Header variant="h3">Flush body</Header>,
    children: 'Content padding is disabled.',
  },
};
export const Stacked: Story = {
  render: () => (
    <div>
      <Container variant="stacked" header={<Header variant="h3">First</Header>}>
        Upper panel
      </Container>
      <Container variant="stacked" header={<Header variant="h3">Second</Header>}>
        Lower panel
      </Container>
    </div>
  ),
};
