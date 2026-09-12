import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ButtonDropdown from './index';

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
HTMLElement.prototype.focus = () => {};
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

const items = [
  { id: 'flash', text: 'Flash firmware' },
  { id: 'erase', text: 'Erase flash', destructive: true },
  { id: 'lock', text: 'Lock', disabled: true },
];

function openTrigger(name: string) {
  fireEvent.keyDown(screen.getByRole('button', { name }), { key: 'ArrowDown' });
}

describe('ButtonDropdown', () => {
  it('opens the menu, clicks an item, and fires onItemClick', async () => {
    const onItemClick = vi.fn();
    render(
      <ButtonDropdown items={items} onItemClick={onItemClick}>
        Actions
      </ButtonDropdown>,
    );

    openTrigger('Actions');
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    fireEvent(
      screen.getByRole('menuitem', { name: 'Flash firmware' }),
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    expect(onItemClick).toHaveBeenCalledWith('flash');
  });

  it('does not open when disabled', () => {
    const onItemClick = vi.fn();
    render(
      <ButtonDropdown items={items} disabled onItemClick={onItemClick}>
        Actions
      </ButtonDropdown>,
    );

    expect(screen.getByRole('button', { name: 'Actions' })).toBeDisabled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('does not fire onItemClick for a disabled item', async () => {
    const onItemClick = vi.fn();
    render(
      <ButtonDropdown items={items} onItemClick={onItemClick}>
        Actions
      </ButtonDropdown>,
    );

    openTrigger('Actions');
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    fireEvent(
      screen.getByRole('menuitem', { name: 'Lock' }),
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    expect(onItemClick).not.toHaveBeenCalled();
  });
});
