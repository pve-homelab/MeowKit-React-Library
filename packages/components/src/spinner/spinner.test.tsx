import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Spinner from './index';

describe('Spinner', () => {
  it('uses a default accessible name of Loading', () => {
    render(<Spinner />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('honors a custom aria-label', () => {
    render(<Spinner aria-label="Flashing firmware" />);
    expect(screen.getByRole('status', { name: 'Flashing firmware' })).toBeInTheDocument();
  });
});
