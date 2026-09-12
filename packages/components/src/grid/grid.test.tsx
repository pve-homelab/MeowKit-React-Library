import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Grid from './index';

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid>
        <span>Alpha</span>
        <span>Beta</span>
      </Grid>,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('uses a 12-column grid and applies colspans from gridDefinition', () => {
    const { container } = render(
      <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
        <span>Narrow</span>
        <span>Wide</span>
      </Grid>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/twelve/);
    expect(root.className).toMatch(/gutters/);
    const cells = Array.from(root.children);
    expect(cells).toHaveLength(2);
    expect(cells[0]?.className).toMatch(/colspan4/);
    expect(cells[1]?.className).toMatch(/colspan8/);
  });

  it('uses equal columns when columns is set', () => {
    const { container } = render(
      <Grid columns={3}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Grid>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/equal/);
    expect(root.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('disables gutters when requested', () => {
    const { container } = render(
      <Grid disableGutters>
        <span>A</span>
      </Grid>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/noGutters/);
    expect(root.className).not.toMatch(/gutters/);
  });
});
