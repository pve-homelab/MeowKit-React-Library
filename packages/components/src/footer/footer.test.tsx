import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from './index';

describe('Footer', () => {
  it('renders children', () => {
    render(<Footer>Footer actions</Footer>);
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });

  it('renders as a footer element', () => {
    render(<Footer>Bar</Footer>);
    expect(screen.getByText('Bar').closest('footer')).toBeInTheDocument();
  });
});
