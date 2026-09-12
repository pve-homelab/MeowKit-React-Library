import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Breadcrumb from './index';

const items = [
  { text: 'Home', href: '/' },
  { text: 'Projects', href: '/projects' },
  { text: 'MeowKit' },
];

describe('Breadcrumb', () => {
  it('renders items in breadcrumb navigation', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getByText('MeowKit')).toBeInTheDocument();
  });

  it('marks the last item as the current page', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('MeowKit')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'MeowKit' })).not.toBeInTheDocument();
  });

  it('fires onClick for ancestor items', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Breadcrumb
        items={[
          { text: 'Home', onClick },
          { text: 'Current' },
        ]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Home' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
