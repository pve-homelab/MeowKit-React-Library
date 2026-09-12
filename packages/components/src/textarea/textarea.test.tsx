import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Textarea from './index';

describe('Textarea', () => {
  it('fires onChange for multiline text', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label="Notes" onChange={onChange} />);
    await user.type(screen.getByLabelText('Notes'), 'line one{Enter}line two');
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText('Notes')).toHaveValue('line one\nline two');
  });

  it('does not fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label="Notes" disabled onChange={onChange} />);
    await user.type(screen.getByLabelText('Notes'), 'hello');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets aria-invalid when invalid', () => {
    render(<Textarea aria-label="Notes" invalid />);
    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards ref to the native textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Notes" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
