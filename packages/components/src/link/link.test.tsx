import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Link from './index';

describe('Link', () => {
  it('renders an anchor with href and children', () => {
    render(<Link href="https://meowkit.cc">Docs</Link>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', 'https://meowkit.cc');
  });

  it('forwards ref to the native anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link ref={ref} href="#flash">
        Flash
      </Link>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current?.getAttribute('href')).toBe('#flash');
  });
});
