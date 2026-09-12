import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tag from './index';

describe('Tag', () => {
  it('renders children', () => {
    render(<Tag>firmware.bin</Tag>);
    expect(screen.getByText('firmware.bin')).toBeInTheDocument();
  });

  it('fires onDismiss from the dismiss button', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Tag onDismiss={onDismiss} dismissLabel="Remove filter">
        serial
      </Tag>,
    );
    await user.click(screen.getByRole('button', { name: 'Remove filter' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('hides the dismiss control when onDismiss is omitted', () => {
    render(<Tag>serial</Tag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
