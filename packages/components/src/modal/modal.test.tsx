import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Modal from './index';

describe('Modal', () => {
  it('shows the dialog when visible', () => {
    render(
      <Modal visible onDismiss={() => undefined} header="Erase flash">
        This cannot be undone.
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Erase flash');
    expect(dialog).toHaveTextContent('This cannot be undone.');
  });

  it('calls onDismiss when dismissed', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Modal visible onDismiss={onDismiss} header="Erase flash">
        This cannot be undone.
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
