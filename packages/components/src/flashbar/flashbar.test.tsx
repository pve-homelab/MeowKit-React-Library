import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MeowKitProvider } from '../provider';
import Flashbar, { useFlashbar } from './index';

function FlashbarHarness() {
  const { add, dismiss, clear, items } = useFlashbar();
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          add({ id: 'toast-1', type: 'success', content: 'Saved to device', dismissible: true })
        }
      >
        Add toast
      </button>
      <button type="button" onClick={() => dismiss('toast-1')}>
        Dismiss toast
      </button>
      <button
        type="button"
        onClick={() =>
          add({ id: 'toast-2', type: 'error', content: 'Flash failed', dismissible: true })
        }
      >
        Add error
      </button>
      <button type="button" onClick={() => clear()}>
        Clear toasts
      </button>
      <span data-testid="count">{items.length}</span>
    </div>
  );
}

describe('Flashbar', () => {
  it('shows an added item', () => {
    render(
      <Flashbar
        items={[
          { id: 'flash-1', type: 'success', content: 'Firmware written', header: 'Flash complete' },
        ]}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Firmware written');
    expect(screen.getByText('Flash complete')).toBeInTheDocument();
  });

  it('removes an item when dismissed', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Flashbar
        items={[
          { id: 'flash-1', type: 'error', content: 'Could not open the port.', dismissible: true },
        ]}
        onDismiss={onDismiss}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledWith('flash-1');
  });

  it('adds an item through useFlashbar into the provider portal host', async () => {
    const user = userEvent.setup();
    render(
      <MeowKitProvider>
        <FlashbarHarness />
      </MeowKitProvider>,
    );

    expect(screen.queryByText('Saved to device')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add toast' }));
    expect(screen.getByText('Saved to device')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    const host = document.querySelector('[data-mk-flashbar-host]');
    expect(host).toBeInstanceOf(HTMLElement);
    expect(host).toHaveStyle({ position: 'fixed', zIndex: 'var(--mk-z-toast)' });
    expect(host).toContainElement(screen.getByText('Saved to device'));
  });

  it('dismisses and clears items from useFlashbar', async () => {
    const user = userEvent.setup();
    render(
      <MeowKitProvider>
        <FlashbarHarness />
      </MeowKitProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Add toast' }));
    await user.click(screen.getByRole('button', { name: 'Add error' }));
    expect(screen.getByTestId('count')).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: 'Dismiss toast' }));
    expect(screen.queryByText('Saved to device')).not.toBeInTheDocument();
    expect(screen.getByText('Flash failed')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear toasts' }));
    expect(screen.queryByText('Flash failed')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
