import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SerialConsoleView from './index';

const lines = [
  { id: '1', text: 'ready', stream: 'system' as const },
  { id: '2', text: 'hello', stream: 'stdout' as const },
  { id: '3', text: 'fail', stream: 'stderr' as const },
];

describe('SerialConsoleView', () => {
  it('renders lines with stream distinction', () => {
    render(<SerialConsoleView lines={lines} onSend={vi.fn()} />);

    expect(screen.getByText('ready')).toHaveAttribute('data-stream', 'system');
    expect(screen.getByText('hello')).toHaveAttribute('data-stream', 'stdout');
    expect(screen.getByText('fail')).toHaveAttribute('data-stream', 'stderr');
  });

  it('defaults omitted stream to stdout', () => {
    render(<SerialConsoleView lines={[{ id: '1', text: 'plain' }]} onSend={vi.fn()} />);

    expect(screen.getByText('plain')).toHaveAttribute('data-stream', 'stdout');
  });

  it('calls onSend with the typed line and clears the input', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<SerialConsoleView lines={[]} onSend={onSend} />);

    const input = screen.getByRole('textbox', { name: /send/i });
    await user.type(input, 'ping');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith('ping');
    expect(input).toHaveValue('');
  });

  it('does not send blank lines', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<SerialConsoleView lines={[]} onSend={onSend} />);

    await user.click(screen.getByRole('button', { name: 'Send' }));
    await user.type(screen.getByRole('textbox', { name: /send/i }), '   ');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(onSend).not.toHaveBeenCalled();
  });

  it('sends on Enter', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<SerialConsoleView lines={[]} onSend={onSend} />);

    await user.type(screen.getByRole('textbox', { name: /send/i }), 'ok{Enter}');

    expect(onSend).toHaveBeenCalledWith('ok');
  });

  it('calls onClear when Clear is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<SerialConsoleView lines={lines} onSend={vi.fn()} onClear={onClear} />);

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not render Clear without onClear', () => {
    render(<SerialConsoleView lines={lines} onSend={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('announces connected by default and disconnected when connected is false', () => {
    const { rerender } = render(<SerialConsoleView lines={[]} onSend={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveAttribute('data-connected', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(/connected/i);

    rerender(<SerialConsoleView lines={[]} onSend={vi.fn()} connected={false} />);
    expect(screen.getByRole('status')).toHaveAttribute('data-connected', 'false');
    expect(screen.getByRole('status')).toHaveTextContent(/disconnected/i);
  });

  it('disables send when disabled or disconnected', () => {
    const { rerender } = render(<SerialConsoleView lines={[]} onSend={vi.fn()} disabled />);

    expect(screen.getByRole('textbox', { name: /send/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();

    rerender(<SerialConsoleView lines={[]} onSend={vi.fn()} connected={false} />);
    expect(screen.getByRole('textbox', { name: /send/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
});
