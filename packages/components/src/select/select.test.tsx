import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Select from './index';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverStub);

HTMLElement.prototype.hasPointerCapture ??= () => false;
HTMLElement.prototype.setPointerCapture ??= () => {};
HTMLElement.prototype.releasePointerCapture ??= () => {};
HTMLElement.prototype.scrollIntoView ??= () => {};

const options = [
  { value: 'usb', label: 'USB' },
  { value: 'serial', label: 'Serial' },
  { value: 'wifi', label: 'Wi-Fi', disabled: true },
];

describe('Select', () => {
  it('opens the listbox, chooses an option, and fires onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={options} placeholder="Choose connection" onChange={onChange} />);

    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    fireEvent(
      screen.getByRole('option', { name: 'Serial' }),
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    expect(onChange).toHaveBeenCalledWith('serial');
  });

  it('sets aria-invalid when invalid', () => {
    render(<Select options={options} placeholder="Choose connection" invalid />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('honors defaultValue when uncontrolled', () => {
    render(<Select options={options} defaultValue="usb" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('USB');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={options} placeholder="Choose connection" disabled onChange={onChange} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});
