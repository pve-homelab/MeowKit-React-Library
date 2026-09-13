import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import DeviceManagerPanel from './index';

const devices = [
  { id: 'uno', name: 'Arduino UNO', status: 'disconnected' as const },
  { id: 'pico', name: 'Pico W', status: 'connected' as const },
  { id: 'esp', name: 'ESP32', status: 'busy' as const },
];

describe('DeviceManagerPanel', () => {
  it('renders device names and statuses', () => {
    render(<DeviceManagerPanel devices={devices} />);

    expect(screen.getByText('Arduino UNO')).toBeInTheDocument();
    expect(screen.getByText('Pico W')).toBeInTheDocument();
    expect(screen.getByText('ESP32')).toBeInTheDocument();
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Busy')).toBeInTheDocument();
  });

  it('calls onSelect with the device id', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DeviceManagerPanel devices={devices} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Arduino UNO' }));
    expect(onSelect).toHaveBeenCalledWith('uno');
  });

  it('calls onConnect and onDisconnect with the selected id', async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();
    const onDisconnect = vi.fn();
    const { rerender } = render(
      <DeviceManagerPanel
        devices={devices}
        selectedId="uno"
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Connect' }));
    expect(onConnect).toHaveBeenCalledWith('uno');

    rerender(
      <DeviceManagerPanel
        devices={devices}
        selectedId="pico"
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Disconnect' }));
    expect(onDisconnect).toHaveBeenCalledWith('pico');
  });

  it('calls onRefresh when Refresh is clicked', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(<DeviceManagerPanel devices={devices} onRefresh={onRefresh} />);

    await user.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('does not render connect, disconnect, or refresh without callbacks', () => {
    render(<DeviceManagerPanel devices={devices} selectedId="uno" />);

    expect(screen.queryByRole('button', { name: 'Connect' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Disconnect' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Refresh' })).not.toBeInTheDocument();
  });

  it('defaults to idle status', () => {
    render(<DeviceManagerPanel devices={[]} />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('data-status', 'idle');
    expect(status).toHaveTextContent(/idle/i);
  });

  it('announces busy and success with status, and error with alert', () => {
    const { rerender } = render(<DeviceManagerPanel devices={[]} status="busy" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'busy');
    expect(screen.getByRole('status')).toHaveTextContent(/busy/i);

    rerender(<DeviceManagerPanel devices={[]} status="success" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'success');
    expect(screen.getByRole('status')).toHaveTextContent(/success/i);

    rerender(<DeviceManagerPanel devices={[]} status="error" />);
    expect(screen.getByRole('alert')).toHaveAttribute('data-status', 'error');
    expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
  });

  it('shows an error message when provided', () => {
    render(<DeviceManagerPanel devices={[]} errorMessage="Port busy" />);
    expect(screen.getByText('Port busy')).toBeInTheDocument();
  });

  it('shows an empty state when there are no devices', () => {
    render(<DeviceManagerPanel devices={[]} />);
    expect(screen.getByText('No devices')).toBeInTheDocument();
  });

  it('disables actions when busy', () => {
    render(
      <DeviceManagerPanel
        devices={devices}
        selectedId="uno"
        status="busy"
        onSelect={vi.fn()}
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Arduino UNO' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Connect' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Disconnect' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeDisabled();
  });

  it('marks the selected device', () => {
    render(<DeviceManagerPanel devices={devices} selectedId="pico" />);
    expect(screen.getByRole('button', { name: 'Pico W' })).toHaveAttribute('data-selected', 'true');
    expect(screen.getByRole('button', { name: 'Arduino UNO' })).toHaveAttribute('data-selected', 'false');
  });
});
