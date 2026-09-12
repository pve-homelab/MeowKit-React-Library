import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Sidebar from './index';

describe('Sidebar', () => {
  it('renders children', () => {
    render(<Sidebar>Nav items</Sidebar>);
    expect(screen.getByText('Nav items')).toBeInTheDocument();
  });

  it('renders a header slot', () => {
    render(<Sidebar header={<h2>Workspace</h2>}>Items</Sidebar>);
    expect(screen.getByRole('heading', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByText('Items')).toBeInTheDocument();
  });

  it('applies numeric and string width', () => {
    const { container, rerender } = render(<Sidebar width={280}>Wide</Sidebar>);
    expect((container.firstChild as HTMLElement).style.width).toBe('280px');

    rerender(<Sidebar width="12rem">Wide</Sidebar>);
    expect((container.firstChild as HTMLElement).style.width).toBe('12rem');
  });

  it('toggles collapse and fires onCollapseChange', async () => {
    const user = userEvent.setup();
    const onCollapseChange = vi.fn();
    render(
      <Sidebar collapsible onCollapseChange={onCollapseChange}>
        Nav
      </Sidebar>,
    );

    expect(screen.getByText('Nav')).toBeVisible();
    await user.click(screen.getByRole('button', { name: /collapse/i }));
    expect(onCollapseChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText('Nav')).not.toBeVisible();
  });

  it('respects a controlled collapsed state', () => {
    const { rerender } = render(
      <Sidebar collapsible collapsed>
        Hidden nav
      </Sidebar>,
    );
    expect(screen.queryByText('Hidden nav')).not.toBeVisible();

    rerender(
      <Sidebar collapsible collapsed={false}>
        Hidden nav
      </Sidebar>,
    );
    expect(screen.getByText('Hidden nav')).toBeVisible();
  });
});
