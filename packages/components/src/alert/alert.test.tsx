import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Alert from './index';

describe('Alert', () => {
  it('uses role alert for error and warning', () => {
    const { rerender } = render(<Alert type="error">Flash failed</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Flash failed');

    rerender(<Alert type="warning">Low battery</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Low battery');
  });

  it('uses a status region for info and success', () => {
    const { rerender } = render(<Alert type="info">Connected</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Connected');

    rerender(<Alert type="success">Flashed</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Flashed');
  });

  it('renders header, children, and action', () => {
    render(
      <Alert header="Device error" action={<button type="button">Retry</button>}>
        Could not open the port.
      </Alert>,
    );
    expect(screen.getByText('Device error')).toBeInTheDocument();
    expect(screen.getByText('Could not open the port.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('fires onDismiss from the dismiss button when dismissible', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Stale session
      </Alert>,
    );
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('hides the dismiss control when dismissible is omitted', () => {
    render(<Alert>Stale session</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
