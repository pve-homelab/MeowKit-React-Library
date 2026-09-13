import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import FirmwareFlashingPanel from './index';

describe('FirmwareFlashingPanel', () => {
  it('renders the device name', () => {
    render(<FirmwareFlashingPanel deviceName="Pico W" status="idle" onConnect={vi.fn()} onFlash={vi.fn()} />);
    expect(screen.getByText('Pico W')).toBeInTheDocument();
  });

  it('shows a no-device label when deviceName is missing', () => {
    render(<FirmwareFlashingPanel status="idle" onConnect={vi.fn()} onFlash={vi.fn()} />);
    expect(screen.getByText('No device')).toBeInTheDocument();
  });

  it('renders a progress bar', () => {
    render(
      <FirmwareFlashingPanel
        deviceName="Pico W"
        status="busy"
        progress={42}
        onConnect={vi.fn()}
        onFlash={vi.fn()}
      />,
    );

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '42');
  });

  it('defaults progress to 0', () => {
    render(<FirmwareFlashingPanel status="idle" onConnect={vi.fn()} onFlash={vi.fn()} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('calls onConnect when Connect is clicked', async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();
    render(<FirmwareFlashingPanel status="idle" onConnect={onConnect} onFlash={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Connect' }));
    expect(onConnect).toHaveBeenCalledTimes(1);
  });

  it('opens an erase confirm modal when Flash is clicked without confirmErase', async () => {
    const user = userEvent.setup();
    const onFlash = vi.fn();
    render(
      <FirmwareFlashingPanel deviceName="Pico W" status="idle" onConnect={vi.fn()} onFlash={onFlash} />,
    );

    await user.click(screen.getByRole('button', { name: 'Flash' }));
    expect(onFlash).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Confirm erase' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Erase and flash' })).toBeInTheDocument();
  });

  it('calls onFlash from the erase confirm modal', async () => {
    const user = userEvent.setup();
    const onFlash = vi.fn();
    render(
      <FirmwareFlashingPanel deviceName="Pico W" status="idle" onConnect={vi.fn()} onFlash={onFlash} />,
    );

    await user.click(screen.getByRole('button', { name: 'Flash' }));
    await user.click(screen.getByRole('button', { name: 'Erase and flash' }));
    expect(onFlash).toHaveBeenCalledTimes(1);
  });

  it('does not call onFlash when the erase modal is dismissed', async () => {
    const user = userEvent.setup();
    const onFlash = vi.fn();
    render(
      <FirmwareFlashingPanel deviceName="Pico W" status="idle" onConnect={vi.fn()} onFlash={onFlash} />,
    );

    await user.click(screen.getByRole('button', { name: 'Flash' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onFlash).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onFlash immediately when confirmErase is true', async () => {
    const user = userEvent.setup();
    const onFlash = vi.fn();
    render(
      <FirmwareFlashingPanel
        deviceName="Pico W"
        status="idle"
        confirmErase
        onConnect={vi.fn()}
        onFlash={onFlash}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Flash' }));
    expect(onFlash).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <FirmwareFlashingPanel
        deviceName="Pico W"
        status="busy"
        onConnect={vi.fn()}
        onFlash={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not render Cancel without onCancel', () => {
    render(<FirmwareFlashingPanel status="idle" onConnect={vi.fn()} onFlash={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('toggles confirm erase via the checkbox', async () => {
    const user = userEvent.setup();
    const onConfirmEraseChange = vi.fn();
    render(
      <FirmwareFlashingPanel
        status="idle"
        confirmErase={false}
        onConnect={vi.fn()}
        onFlash={vi.fn()}
        onConfirmEraseChange={onConfirmEraseChange}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: /confirm erase/i }));
    expect(onConfirmEraseChange).toHaveBeenCalledWith(true);
  });

  it('does not render the confirm-erase checkbox without onConfirmEraseChange', () => {
    render(<FirmwareFlashingPanel status="idle" onConnect={vi.fn()} onFlash={vi.fn()} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('defaults to idle status announcement', () => {
    render(<FirmwareFlashingPanel status="idle" onConnect={vi.fn()} onFlash={vi.fn()} />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('data-status', 'idle');
    expect(status).toHaveTextContent(/idle/i);
  });

  it('announces busy and success with status, and error with alert', () => {
    const { rerender } = render(
      <FirmwareFlashingPanel status="busy" onConnect={vi.fn()} onFlash={vi.fn()} />,
    );
    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'busy');
    expect(screen.getByRole('status')).toHaveTextContent(/busy/i);

    rerender(<FirmwareFlashingPanel status="success" onConnect={vi.fn()} onFlash={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'success');
    expect(screen.getByRole('status')).toHaveTextContent(/success/i);

    rerender(<FirmwareFlashingPanel status="error" onConnect={vi.fn()} onFlash={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveAttribute('data-status', 'error');
    expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
  });

  it('shows an error message when provided', () => {
    render(
      <FirmwareFlashingPanel
        status="error"
        errorMessage="Flash failed"
        onConnect={vi.fn()}
        onFlash={vi.fn()}
      />,
    );
    expect(screen.getByText('Flash failed')).toBeInTheDocument();
  });

  it('disables connect and flash when busy', () => {
    render(
      <FirmwareFlashingPanel
        deviceName="Pico W"
        status="busy"
        onConnect={vi.fn()}
        onFlash={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Connect' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Flash' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  });
});
