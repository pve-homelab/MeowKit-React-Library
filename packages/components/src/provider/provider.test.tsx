import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MeowKitProvider, useMeowKit } from './index';

function Probe() {
  const { mode, accent, setMode, setAccent } = useMeowKit();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="accent">{accent}</span>
      <button type="button" onClick={() => setMode('dark')}>
        dark
      </button>
      <button type="button" onClick={() => setAccent('lime')}>
        lime
      </button>
    </div>
  );
}

describe('MeowKitProvider', () => {
  it('applies mode and accent to documentElement', async () => {
    const user = userEvent.setup();
    render(
      <MeowKitProvider mode="light" accent="default">
        <Probe />
      </MeowKitProvider>,
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    await user.click(screen.getByRole('button', { name: 'dark' }));
    expect(document.documentElement.getAttribute('data-mk-mode')).toBe('dark');
    await user.click(screen.getByRole('button', { name: 'lime' }));
    expect(document.documentElement.getAttribute('data-mk-accent')).toBe('lime');
  });
});
