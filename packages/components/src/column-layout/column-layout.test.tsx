import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ColumnLayout from './index';

describe('ColumnLayout', () => {
  it('renders children', () => {
    render(
      <ColumnLayout>
        <span>Left</span>
        <span>Right</span>
      </ColumnLayout>,
    );
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('defaults to one column and the default variant', () => {
    const { container } = render(
      <ColumnLayout>
        <span>Only</span>
      </ColumnLayout>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/columns1/);
    expect(root.className).toMatch(/variantDefault/);
  });

  it('applies the requested column count', () => {
    const { container } = render(
      <ColumnLayout columns={3}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </ColumnLayout>,
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/columns3/);
  });

  it('applies the text-grid variant', () => {
    const { container } = render(
      <ColumnLayout variant="text-grid">
        <span>Copy</span>
      </ColumnLayout>,
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/variantTextGrid/);
  });
});
