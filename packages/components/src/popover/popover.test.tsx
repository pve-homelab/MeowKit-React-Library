import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Popover from './index';

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
HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
  return {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 36,
    right: 120,
    width: 120,
    height: 36,
    toJSON() {
      return {};
    },
  };
};

describe('Popover', () => {
  it('opens content when the trigger is clicked', () => {
    render(
      <Popover content="Port COM3 is open">
        <button type="button">Details</button>
      </Popover>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Port COM3 is open');
  });

  it('shows content when open is true', () => {
    render(
      <Popover open content="Port COM3 is open">
        <button type="button">Details</button>
      </Popover>,
    );

    expect(screen.getByRole('dialog')).toHaveTextContent('Port COM3 is open');
  });

  it('shows content when defaultOpen is true', () => {
    render(
      <Popover defaultOpen content="Port COM3 is open">
        <button type="button">Details</button>
      </Popover>,
    );

    expect(screen.getByRole('dialog')).toHaveTextContent('Port COM3 is open');
  });

  it('calls onOpenChange when opened and dismissed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Popover content="Port COM3 is open" onOpenChange={onOpenChange}>
        <button type="button">Details</button>
      </Popover>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
