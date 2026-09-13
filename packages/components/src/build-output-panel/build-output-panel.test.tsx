import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import BuildOutputPanel from './index';

describe('BuildOutputPanel', () => {
  it('renders lines in a code log', () => {
    render(<BuildOutputPanel lines={['Compiling sketch...', 'Done.']} />);

    const log = screen.getByText(/Compiling sketch/);
    expect(log.closest('code')).not.toBeNull();
    expect(log.closest('pre')).not.toBeNull();
    expect(log).toHaveTextContent('Done.');
  });

  it('defaults to idle status', () => {
    render(<BuildOutputPanel lines={[]} />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('data-status', 'idle');
    expect(status).toHaveTextContent(/idle/i);
  });

  it('announces busy and success with status, and error with alert', () => {
    const { rerender } = render(<BuildOutputPanel lines={[]} status="busy" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'busy');
    expect(screen.getByRole('status')).toHaveTextContent(/busy/i);

    rerender(<BuildOutputPanel lines={[]} status="success" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'success');
    expect(screen.getByRole('status')).toHaveTextContent(/success/i);

    rerender(<BuildOutputPanel lines={[]} status="error" />);
    expect(screen.getByRole('alert')).toHaveAttribute('data-status', 'error');
    expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
  });

  it('calls onClear when Clear is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<BuildOutputPanel lines={['a']} onClear={onClear} />);

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not render Clear without onClear', () => {
    render(<BuildOutputPanel lines={['a']} />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });
});
