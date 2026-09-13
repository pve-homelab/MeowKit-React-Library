import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import StorageManagerView from './index';

const entries = [
  { id: 'lib', name: 'lib', type: 'folder' as const },
  { id: 'main', name: 'main.py', type: 'file' as const, size: 128 },
];

describe('StorageManagerView', () => {
  it('renders the current path and entries', () => {
    render(<StorageManagerView entries={entries} path="/CIRCUITPY" onNavigate={vi.fn()} />);

    expect(screen.getByText('/CIRCUITPY')).toBeInTheDocument();
    expect(screen.getByText('lib')).toBeInTheDocument();
    expect(screen.getByText('main.py')).toBeInTheDocument();
    expect(screen.getByText('Folder')).toBeInTheDocument();
    expect(screen.getByText('128 B')).toBeInTheDocument();
  });

  it('calls onNavigate with the entry id', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<StorageManagerView entries={entries} path="/" onNavigate={onNavigate} />);

    await user.click(screen.getByRole('button', { name: 'lib' }));
    expect(onNavigate).toHaveBeenCalledWith('lib');

    await user.click(screen.getByRole('button', { name: 'main.py' }));
    expect(onNavigate).toHaveBeenCalledWith('main');
  });

  it('calls optional upload, delete, and refresh callbacks', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn();
    const onDelete = vi.fn();
    const onRefresh = vi.fn();
    render(
      <StorageManagerView
        entries={entries}
        path="/"
        onNavigate={vi.fn()}
        onUpload={onUpload}
        onDelete={onDelete}
        onRefresh={onRefresh}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Upload' }));
    await user.click(screen.getByRole('button', { name: 'Refresh' }));
    await user.click(screen.getByRole('button', { name: 'Delete main.py' }));

    expect(onUpload).toHaveBeenCalledTimes(1);
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('main');
  });

  it('does not render upload, delete, or refresh without callbacks', () => {
    render(<StorageManagerView entries={entries} path="/" onNavigate={vi.fn()} />);

    expect(screen.queryByRole('button', { name: 'Upload' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Refresh' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('defaults to idle status', () => {
    render(<StorageManagerView entries={[]} path="/" onNavigate={vi.fn()} />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('data-status', 'idle');
    expect(status).toHaveTextContent(/idle/i);
  });

  it('announces busy and success with status, and error with alert', () => {
    const { rerender } = render(
      <StorageManagerView entries={[]} path="/" onNavigate={vi.fn()} status="busy" />,
    );
    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'busy');
    expect(screen.getByRole('status')).toHaveTextContent(/busy/i);

    rerender(<StorageManagerView entries={[]} path="/" onNavigate={vi.fn()} status="success" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'success');
    expect(screen.getByRole('status')).toHaveTextContent(/success/i);

    rerender(<StorageManagerView entries={[]} path="/" onNavigate={vi.fn()} status="error" />);
    expect(screen.getByRole('alert')).toHaveAttribute('data-status', 'error');
    expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
  });

  it('shows an empty state when there are no entries', () => {
    render(<StorageManagerView entries={[]} path="/" onNavigate={vi.fn()} />);
    expect(screen.getByText('No files')).toBeInTheDocument();
  });

  it('disables actions when busy', () => {
    render(
      <StorageManagerView
        entries={entries}
        path="/"
        onNavigate={vi.fn()}
        onUpload={vi.fn()}
        onDelete={vi.fn()}
        onRefresh={vi.fn()}
        status="busy"
      />,
    );

    expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'lib' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Delete main.py' })).toBeDisabled();
  });
});
