import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SpaceBetween from './index';

describe('SpaceBetween', () => {
  it('renders children', () => {
    render(
      <SpaceBetween>
        <span>One</span>
        <span>Two</span>
      </SpaceBetween>,
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('defaults to vertical direction and medium gap', () => {
    const { container } = render(
      <SpaceBetween>
        <span>A</span>
        <span>B</span>
      </SpaceBetween>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/vertical/);
    expect(el.className).toMatch(/sizeM/);
  });

  it('applies horizontal direction', () => {
    const { container } = render(
      <SpaceBetween direction="horizontal" size="s">
        <span>A</span>
        <span>B</span>
      </SpaceBetween>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/horizontal/);
    expect(el.className).toMatch(/sizeS/);
  });

  it('maps size tokens to space scale classes', () => {
    const { rerender, container } = render(
      <SpaceBetween size="xs">
        <span>A</span>
      </SpaceBetween>,
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/sizeXs/);

    rerender(
      <SpaceBetween size="l">
        <span>A</span>
      </SpaceBetween>,
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/sizeL/);

    rerender(
      <SpaceBetween size="xl">
        <span>A</span>
      </SpaceBetween>,
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/sizeXl/);
  });
});
