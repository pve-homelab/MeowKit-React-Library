import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SegmentedControl from './index';

const options = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'table', label: 'Table', disabled: true },
];

describe('SegmentedControl', () => {
  it('selects a segment and fires onChange with the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SegmentedControl options={options} onChange={onChange} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Grid' }));
    expect(onChange).toHaveBeenCalledWith('grid');
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked();
  });

  it('honors defaultValue when uncontrolled', () => {
    render(<SegmentedControl options={options} defaultValue="list" />);
    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
  });

  it('does not fire onChange for a disabled option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SegmentedControl options={options} onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'Table' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
