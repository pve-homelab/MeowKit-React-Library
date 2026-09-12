import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchInput from './index';

describe('SearchInput', () => {
  it('renders a searchbox with type search', () => {
    render(<SearchInput aria-label="Search devices" />);
    const input = screen.getByRole('searchbox', { name: 'Search devices' });
    expect(input).toHaveAttribute('type', 'search');
  });

  it('calls onClear when the clear control is activated', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<SearchInput aria-label="Search devices" defaultValue="kit" onClear={onClear} />);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('sets aria-invalid when invalid', () => {
    render(<SearchInput aria-label="Search devices" invalid />);
    expect(screen.getByRole('searchbox', { name: 'Search devices' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });
});
