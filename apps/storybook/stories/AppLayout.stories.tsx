import type { Meta, StoryObj } from '@storybook/react';
import AppLayout, { type AppLayoutProps } from '@meowkit/components/app-layout';
import Container from '@meowkit/components/container';
import Flashbar from '@meowkit/components/flashbar';
import Header from '@meowkit/components/header';
import Sidebar from '@meowkit/components/sidebar';
import StatusBar from '@meowkit/components/status-bar';
import { useState } from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    content: 'Workspace content',
    navigationOpen: true,
    toolsOpen: true,
    stickyNotifications: true,
  },
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

function ShellDemo(args: AppLayoutProps) {
  const [navigationOpen, setNavigationOpen] = useState(args.navigationOpen ?? true);
  const [toolsOpen, setToolsOpen] = useState(args.toolsOpen ?? true);

  return (
    <div style={{ height: '100vh' }}>
      <AppLayout
        {...args}
        navigation={
          args.navigation ?? (
            <Sidebar header="Workspace">
              Devices, workspaces, and settings.
            </Sidebar>
          )
        }
        tools={args.tools ?? 'Inspector, logs, and device details.'}
        contentHeader={
          args.contentHeader ?? (
            <Header variant="h1" description="Cloudscape-inspired application shell">
              Companion
            </Header>
          )
        }
        notifications={
          args.notifications ?? (
            <Flashbar
              items={[
                {
                  id: 'saved',
                  type: 'success',
                  header: 'Saved',
                  content: 'Workspace settings updated.',
                },
              ]}
            />
          )
        }
        statusBar={
          args.statusBar ?? (
            <StatusBar left="COM3" right="Connected">
              Ready
            </StatusBar>
          )
        }
        content={
          args.content === 'Workspace content' ? (
            <Container header={<Header variant="h2">Main panel</Header>}>
              Primary content sits between navigation and tools. Use the chrome toggles
              to open or close either drawer.
            </Container>
          ) : (
            args.content
          )
        }
        navigationOpen={navigationOpen}
        toolsOpen={toolsOpen}
        onNavigationChange={(open) => {
          setNavigationOpen(open);
          args.onNavigationChange?.(open);
        }}
        onToolsChange={(open) => {
          setToolsOpen(open);
          args.onToolsChange?.(open);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <ShellDemo {...args} />,
};

export const ContentOnly: Story = {
  args: {
    navigation: undefined,
    tools: undefined,
    contentHeader: undefined,
    notifications: undefined,
    statusBar: undefined,
    content: 'Content without chrome.',
  },
};
