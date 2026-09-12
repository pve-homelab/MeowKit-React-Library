import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import NumberInput from './index';

function ControlledNumberInput() {
  const [value, setValue] = useState<number | ''>('');
  return <NumberInput aria-label="Port" value={value} onChange={setValue} />;
}

describe('NumberInput', () => {
  it('updates controlled value via typing', async () => {
    const user = userEvent.setup();
    render(<ControlledNumberInput />);
    const input = screen.getByRole('spinbutton', { name: 'Port' });
    await user.type(input, '42');
    expect(input).toHaveValue(42);
  });

  it('emits empty string when the field is cleared', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput aria-label="Port" value={8} onChange={onChange} />);
    await user.clear(screen.getByRole('spinbutton', { name: 'Port' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('sets aria-invalid when invalid', () => {
    render(<NumberInput aria-label="Port" invalid />);
    expect(screen.getByRole('spinbutton', { name: 'Port' })).toHaveAttribute('aria-invalid', 'true');
  });
});
