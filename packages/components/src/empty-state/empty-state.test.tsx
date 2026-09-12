import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmptyState from './index';

describe('EmptyState', () => {
  it('renders the title as a heading', () => {
    render(<EmptyState title="No devices" />);
    expect(screen.getByRole('heading', { name: 'No devices' })).toBeInTheDocument();
  });

  it('renders description, action, and icon when provided', () => {
    render(
      <EmptyState
        title="No files"
        description="Upload a sketch to get started."
        action={<button type="button">Upload</button>}
        icon={<span>folder-icon</span>}
      />,
    );
    expect(screen.getByText('Upload a sketch to get started.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
    expect(screen.getByText('folder-icon')).toBeInTheDocument();
  });

  it('omits optional slots when they are not provided', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByText('Upload a sketch to get started.')).not.toBeInTheDocument();
  });
});
