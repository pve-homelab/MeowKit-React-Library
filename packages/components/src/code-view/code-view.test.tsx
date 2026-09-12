import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CodeView from './index';

describe('CodeView', () => {
  it('renders content in a pre/code block', () => {
    render(<CodeView content="const x = 1;" />);
    const text = screen.getByText('const x = 1;');
    expect(text.closest('code')).not.toBeNull();
    expect(text.closest('pre')).not.toBeNull();
  });

  it('does not render a line number gutter by default', () => {
    const { container } = render(<CodeView content={'one\ntwo'} />);
    expect(container.querySelector('[data-line-number]')).not.toBeInTheDocument();
  });

  it('renders a line number gutter when lineNumbers is true', () => {
    const { container } = render(<CodeView content={'one\ntwo\nthree'} lineNumbers />);
    expect(container.querySelector('[data-line-number="1"]')).toHaveTextContent('1');
    expect(container.querySelector('[data-line-number="2"]')).toHaveTextContent('2');
    expect(container.querySelector('[data-line-number="3"]')).toHaveTextContent('3');
    expect(container.querySelector('code')?.textContent).toBe('one\ntwo\nthree');
  });

  it('applies className to the root', () => {
    const { container } = render(<CodeView content="x" className="extra" />);
    expect((container.firstChild as HTMLElement).className).toMatch(/extra/);
  });

  it('accepts a reserved language prop without highlighting', () => {
    render(<CodeView content="fn main() {}" language="rust" />);
    expect(screen.getByText('fn main() {}')).toBeInTheDocument();
    expect(screen.queryByText(/span/i)).not.toBeInTheDocument();
  });
});
