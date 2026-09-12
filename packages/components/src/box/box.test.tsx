import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Box from './index';

describe('Box', () => {
  it('renders children', () => {
    render(<Box>Content</Box>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies padding and margin token classes', () => {
    const { container } = render(
      <Box padding={3} margin="none">
        Spaced
      </Box>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/padding3/);
    expect(el.className).toMatch(/marginNone/);
  });

  it('applies color, fontSize, and fontWeight token classes', () => {
    const { container } = render(
      <Box color="muted" fontSize="lg" fontWeight="bold">
        Typed
      </Box>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/colorMuted/);
    expect(el.className).toMatch(/fontSizeLg/);
    expect(el.className).toMatch(/fontWeightBold/);
  });

  it('renders as the given element', () => {
    render(<Box as="section">Region</Box>);
    expect(screen.getByText('Region').tagName).toBe('SECTION');
  });
});
