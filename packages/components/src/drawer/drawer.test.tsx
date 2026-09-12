import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Drawer from './index';

describe('Drawer', () => {
  it('shows the dialog when visible', () => {
    render(
      <Drawer visible onDismiss={() => undefined} header="Device details">
        Port COM3 is open.
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Device details');
    expect(dialog).toHaveTextContent('Port COM3 is open.');
  });

  it('calls onDismiss when dismissed', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Drawer visible onDismiss={onDismiss} header="Device details">
        Port COM3 is open.
      </Drawer>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('docks to the right by default and to the left when asked', () => {
    const { rerender } = render(
      <Drawer visible onDismiss={() => undefined} header="Device details">
        Port COM3 is open.
      </Drawer>,
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('data-position', 'right');

    rerender(
      <Drawer visible onDismiss={() => undefined} header="Device details" position="left">
        Port COM3 is open.
      </Drawer>,
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('data-position', 'left');
  });
});
