import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from './index';

describe('Header', () => {
  it('renders children', () => {
    render(<Header>Section title</Header>);
    expect(screen.getByText('Section title')).toBeInTheDocument();
  });

  it('defaults to an h2 heading', () => {
    render(<Header>Default heading</Header>);
    expect(screen.getByRole('heading', { level: 2, name: /Default heading/ })).toBeInTheDocument();
  });

  it('renders the heading at the given variant', () => {
    render(<Header variant="h3">Subsection</Header>);
    expect(screen.getByRole('heading', { level: 3, name: 'Subsection' })).toBeInTheDocument();
  });

  it('renders description, actions, and counter', () => {
    render(
      <Header description="Helpful copy" actions={<button type="button">Edit</button>} counter="(3)">
        Resources
      </Header>,
    );
    expect(screen.getByText('Helpful copy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByText('(3)')).toBeInTheDocument();
  });
});
