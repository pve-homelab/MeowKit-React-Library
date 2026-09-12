import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Container from './index';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Panel body</Container>);
    expect(screen.getByText('Panel body')).toBeInTheDocument();
  });

  it('renders header and footer slots', () => {
    render(
      <Container header={<h2>Panel title</h2>} footer={<span>Panel footer</span>}>
        Body
      </Container>,
    );
    expect(screen.getByRole('heading', { name: 'Panel title' })).toBeInTheDocument();
    expect(screen.getByText('Panel footer')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('applies content padding by default and can disable it', () => {
    const { container, rerender } = render(<Container>Padded</Container>);
    const content = (container.firstChild as HTMLElement).querySelector('[class*="content"]') as HTMLElement;
    expect(content.className).toMatch(/contentPadded/);
    expect(content.className).not.toMatch(/contentFlush/);

    rerender(<Container disableContentPaddings>Flush</Container>);
    const flush = (container.firstChild as HTMLElement).querySelector('[class*="content"]') as HTMLElement;
    expect(flush.className).toMatch(/contentFlush/);
    expect(flush.className).not.toMatch(/contentPadded/);
  });

  it('applies default and stacked surface variants', () => {
    const { container, rerender } = render(<Container>Default</Container>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/root/);
    expect(root.className).toMatch(/default/);
    expect(root.className).not.toMatch(/stacked/);

    rerender(<Container variant="stacked">Stacked</Container>);
    const stacked = container.firstChild as HTMLElement;
    expect(stacked.className).toMatch(/stacked/);
    expect(stacked.className).not.toMatch(/default/);
  });
});
