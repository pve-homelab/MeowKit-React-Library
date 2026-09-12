import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Pagination from './index';

describe('Pagination', () => {
  it('renders page buttons and marks the current page', () => {
    render(<Pagination currentPageIndex={2} pagesCount={3} onChange={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
  });

  it('fires onChange when a page is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination currentPageIndex={1} pagesCount={3} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('disables previous on the first page and next on the last', () => {
    const { rerender } = render(
      <Pagination currentPageIndex={1} pagesCount={4} onChange={() => {}} />,
    );
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();

    rerender(<Pagination currentPageIndex={4} pagesCount={4} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('fires onChange from previous and next', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination currentPageIndex={2} pagesCount={4} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onChange).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('applies custom aria labels', () => {
    render(
      <Pagination
        currentPageIndex={1}
        pagesCount={2}
        onChange={() => {}}
        ariaLabels={{ next: 'Go forward', previous: 'Go back', page: 'Go to page' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go forward' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
  });
});
