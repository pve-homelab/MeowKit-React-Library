import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from './index';

describe('Checkbox', () => {
  it('toggles and fires onChange with a boolean', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Enable serial</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Enable serial' });
    expect(box).not.toBeChecked();
    await user.click(box);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(box).toBeChecked();
  });

  it('does not fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkbox disabled onChange={onChange}>
        Enable serial
      </Checkbox>,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Enable serial' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets the native indeterminate property', () => {
    render(<Checkbox indeterminate>Select all</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
  });

  it('honors defaultChecked when uncontrolled', () => {
    render(<Checkbox defaultChecked>Remember device</Checkbox>);
    expect(screen.getByRole('checkbox', { name: 'Remember device' })).toBeChecked();
  });
});
