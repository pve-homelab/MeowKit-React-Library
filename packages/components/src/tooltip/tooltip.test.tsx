import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MeowKitProvider } from '../provider';
import Tooltip from './index';

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

describe('Tooltip', () => {
  it('shows content on hover when wrapped in MeowKitProvider', async () => {
    render(
      <MeowKitProvider>
        <Tooltip content="COM3 is open">
          <button type="button">Port</button>
        </Tooltip>
      </MeowKitProvider>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    fireEvent.pointerMove(screen.getByRole('button', { name: 'Port' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('COM3 is open');
  });

  it('places the tooltip on the requested side', async () => {
    render(
      <MeowKitProvider>
        <Tooltip content="COM3 is open" side="right">
          <button type="button">Port</button>
        </Tooltip>
      </MeowKitProvider>,
    );

    fireEvent.pointerMove(screen.getByRole('button', { name: 'Port' }));
    expect(await screen.findByRole('tooltip')).toHaveAttribute('data-side', 'right');
  });
});
