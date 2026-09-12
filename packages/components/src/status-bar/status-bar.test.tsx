import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StatusBar from './index';

describe('StatusBar', () => {
  it('renders children', () => {
    render(<StatusBar>Ready</StatusBar>);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('renders left and right slots', () => {
    render(
      <StatusBar left={<span>Ln 12</span>} right={<span>UTF-8</span>}>
        Connected
      </StatusBar>,
    );
    expect(screen.getByText('Ln 12')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('UTF-8')).toBeInTheDocument();
  });

  it('renders as a status strip', () => {
    render(<StatusBar>Idle</StatusBar>);
    expect(screen.getByRole('status')).toHaveTextContent('Idle');
  });
});
