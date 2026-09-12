import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Badge from './index';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies the color class', () => {
    const { container } = render(<Badge color="success">Ready</Badge>);
    expect((container.firstChild as HTMLElement).className).toMatch(/success/);
  });
});
