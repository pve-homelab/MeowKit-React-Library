import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Input from './index';

describe('Input', () => {
  it('types text and fires onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="Device name" onChange={onChange} />);
    await user.type(screen.getByLabelText('Device name'), 'Meow');
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText('Device name')).toHaveValue('Meow');
  });

  it('does not fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="Device name" disabled onChange={onChange} />);
    await user.type(screen.getByLabelText('Device name'), 'Meow');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets aria-invalid when invalid', () => {
    render(<Input aria-label="Device name" invalid />);
    expect(screen.getByLabelText('Device name')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Device name" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
