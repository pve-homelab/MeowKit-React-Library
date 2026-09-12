import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Toolbar from './index';

describe('Toolbar', () => {
  it('renders children', () => {
    render(<Toolbar>Main tools</Toolbar>);
    expect(screen.getByText('Main tools')).toBeInTheDocument();
  });

  it('renders left and right slots', () => {
    render(
      <Toolbar left={<button type="button">Menu</button>} right={<button type="button">Share</button>}>
        Title
      </Toolbar>,
    );
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
  });

  it('renders as a toolbar', () => {
    render(<Toolbar>Tools</Toolbar>);
    expect(screen.getByRole('toolbar')).toHaveTextContent('Tools');
  });
});
