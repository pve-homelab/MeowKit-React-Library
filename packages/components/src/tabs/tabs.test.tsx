import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tabs from './index';

const tabs = [
  { id: 'overview', label: 'Overview', content: 'Overview panel' },
  { id: 'logs', label: 'Logs', content: 'Logs panel' },
  { id: 'settings', label: 'Settings', content: 'Settings panel', disabled: true },
];

describe('Tabs', () => {
  it('activates a tab, shows its content, and fires onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} defaultActiveTabId="overview" onChange={onChange} />);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    await user.click(screen.getByRole('tab', { name: 'Logs' }));
    expect(onChange).toHaveBeenCalledWith('logs');
    expect(screen.getByRole('tab', { name: 'Logs' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Logs panel');
  });

  it('honors defaultActiveTabId when uncontrolled', () => {
    render(<Tabs tabs={tabs} defaultActiveTabId="logs" />);
    expect(screen.getByRole('tab', { name: 'Logs' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Logs panel');
  });

  it('does not fire onChange for a disabled tab', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} defaultActiveTabId="overview" onChange={onChange} />);
    await user.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
  });
});
