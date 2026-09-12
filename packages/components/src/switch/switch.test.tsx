import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Switch from './index';

describe('Switch', () => {
  it('toggles and fires onCheckedChange', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Dark mode" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch', { name: 'Dark mode' });
    expect(control).not.toBeChecked();
    await user.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toBeChecked();
  });

  it('does not fire onCheckedChange when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Dark mode" disabled onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch', { name: 'Dark mode' }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('warns when it lacks an accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Switch />);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
