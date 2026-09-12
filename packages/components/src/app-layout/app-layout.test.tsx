import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AppLayout from './index';

describe('AppLayout', () => {
  it('renders content', () => {
    render(<AppLayout content={<p>Main workspace</p>} />);
    expect(screen.getByRole('main')).toHaveTextContent('Main workspace');
  });

  it('toggles navigation and fires onNavigationChange', async () => {
    const user = userEvent.setup();
    const onNavigationChange = vi.fn();
    render(
      <AppLayout
        navigation={<nav>Device tree</nav>}
        navigationOpen
        onNavigationChange={onNavigationChange}
        content="Body"
      />,
    );

    expect(screen.getByText('Device tree')).toBeVisible();
    await user.click(screen.getByRole('button', { name: /close navigation/i }));
    expect(onNavigationChange).toHaveBeenCalledWith(false);
  });

  it('hides navigation when navigationOpen is false', () => {
    render(
      <AppLayout
        navigation="Side nav"
        navigationOpen={false}
        content="Body"
      />,
    );
    expect(screen.queryByText('Side nav')).not.toBeVisible();
  });

  it('toggles tools and fires onToolsChange', async () => {
    const user = userEvent.setup();
    const onToolsChange = vi.fn();
    render(
      <AppLayout
        tools="Inspector"
        toolsOpen
        onToolsChange={onToolsChange}
        content="Body"
      />,
    );

    expect(screen.getByText('Inspector')).toBeVisible();
    await user.click(screen.getByRole('button', { name: /close tools/i }));
    expect(onToolsChange).toHaveBeenCalledWith(false);
  });

  it('renders content header, notifications, and status bar', () => {
    render(
      <AppLayout
        content="Body"
        contentHeader={<h1>Workspace</h1>}
        notifications={<div>Saved</div>}
        statusBar="Ready"
        stickyNotifications
      />,
    );

    expect(screen.getByRole('heading', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });
});
