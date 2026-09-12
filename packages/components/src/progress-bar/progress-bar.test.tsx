import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProgressBar from './index';

describe('ProgressBar', () => {
  it('exposes role progressbar with aria-valuenow', () => {
    render(<ProgressBar value={40} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('honors max and shows label plus description', () => {
    render(<ProgressBar value={8} max={10} label="Flash" description="8 of 10 blocks" />);
    const bar = screen.getByRole('progressbar', { name: 'Flash' });
    expect(bar).toHaveAttribute('aria-valuemax', '10');
    expect(bar).toHaveAttribute('aria-valuenow', '8');
    expect(screen.getByText('8 of 10 blocks')).toBeInTheDocument();
  });
});
