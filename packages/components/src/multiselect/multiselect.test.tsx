import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Multiselect from './index';

const options = [
  { value: 'esp32', label: 'ESP32' },
  { value: 'pico', label: 'Pico' },
  { value: 'stm32', label: 'STM32', disabled: true },
];

describe('Multiselect', () => {
  it('selects an option, shows a chip, and fires onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Multiselect options={options} placeholder="Choose boards" aria-label="Boards" onChange={onChange} />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Boards' }));
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');

    await user.click(screen.getByRole('option', { name: 'ESP32' }));
    expect(onChange).toHaveBeenCalledWith(['esp32']);
    expect(screen.getByRole('button', { name: 'Remove ESP32' })).toBeInTheDocument();
  });

  it('dismisses a selected tag and fires onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Multiselect
        options={options}
        defaultValue={['esp32', 'pico']}
        aria-label="Boards"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove ESP32' }));
    expect(onChange).toHaveBeenCalledWith(['pico']);
    expect(screen.queryByRole('button', { name: 'Remove ESP32' })).not.toBeInTheDocument();
    expect(screen.getByText('Pico')).toBeInTheDocument();
  });

  it('sets aria-invalid when invalid', () => {
    render(<Multiselect options={options} placeholder="Choose boards" aria-label="Boards" invalid />);
    expect(screen.getByRole('combobox', { name: 'Boards' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Multiselect
        options={options}
        placeholder="Choose boards"
        aria-label="Boards"
        disabled
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Boards' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('limits visible chips with tokenLimit', () => {
    render(
      <Multiselect
        options={options}
        defaultValue={['esp32', 'pico']}
        tokenLimit={1}
        aria-label="Boards"
      />,
    );

    expect(screen.getByText('ESP32')).toBeInTheDocument();
    expect(screen.queryByText('Pico')).not.toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });
});
