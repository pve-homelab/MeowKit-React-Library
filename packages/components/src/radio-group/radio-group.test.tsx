import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RadioGroup from './index';

const items = [
  { value: 'usb', label: 'USB' },
  { value: 'serial', label: 'Serial' },
  { value: 'wifi', label: 'Wi-Fi', disabled: true },
];

describe('RadioGroup', () => {
  it('selects a radio and fires onChange with the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioGroup items={items} onChange={onChange} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Serial' }));
    expect(onChange).toHaveBeenCalledWith('serial');
    expect(screen.getByRole('radio', { name: 'Serial' })).toBeChecked();
  });

  it('honors defaultValue when uncontrolled', () => {
    render(<RadioGroup items={items} defaultValue="usb" />);
    expect(screen.getByRole('radio', { name: 'USB' })).toBeChecked();
  });

  it('does not fire onChange when the group is disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioGroup items={items} disabled onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'USB' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not fire onChange for a disabled item', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioGroup items={items} onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'Wi-Fi' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
