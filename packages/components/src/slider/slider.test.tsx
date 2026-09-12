import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Slider from './index';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverStub);

describe('Slider', () => {
  it('changes value and fires onChange with a number array', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={[40]} onChange={onChange} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('aria-valuenow', '40');
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith([41]);
  });

  it('does not fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={[40]} disabled onChange={onChange} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('honors defaultValue when uncontrolled', () => {
    render(<Slider aria-label="Volume" defaultValue={[25]} />);
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveAttribute('aria-valuenow', '25');
  });

  it('warns when it lacks an accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Slider defaultValue={[0]} />);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
