import styles from './styles.module.css';

export interface PaginationAriaLabels {
  next?: string;
  previous?: string;
  page?: string | ((pageIndex: number) => string);
}

export interface PaginationProps {
  currentPageIndex: number;
  pagesCount: number;
  onChange: (pageIndex: number) => void;
  ariaLabels?: PaginationAriaLabels;
}

function pageLabel(pageIndex: number, page?: PaginationAriaLabels['page']) {
  if (typeof page === 'function') {
    return page(pageIndex);
  }
  if (typeof page === 'string') {
    return `${page} ${pageIndex}`;
  }
  return `Page ${pageIndex}`;
}

export function InternalPagination({
  currentPageIndex,
  pagesCount,
  onChange,
  ariaLabels,
}: PaginationProps) {
  const previousLabel = ariaLabels?.previous ?? 'Previous page';
  const nextLabel = ariaLabels?.next ?? 'Next page';
  const pages = Array.from({ length: Math.max(0, pagesCount) }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className={styles.root}>
      <button
        type="button"
        className={styles.control}
        aria-label={previousLabel}
        disabled={currentPageIndex <= 1}
        onClick={() => onChange(currentPageIndex - 1)}
      >
        ‹
      </button>
      {pages.map((pageIndex) => {
        const isCurrent = pageIndex === currentPageIndex;
        return (
          <button
            key={pageIndex}
            type="button"
            className={styles.page}
            aria-label={pageLabel(pageIndex, ariaLabels?.page)}
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => {
              if (!isCurrent) {
                onChange(pageIndex);
              }
            }}
          >
            {pageIndex}
          </button>
        );
      })}
      <button
        type="button"
        className={styles.control}
        aria-label={nextLabel}
        disabled={currentPageIndex >= pagesCount}
        onClick={() => onChange(currentPageIndex + 1)}
      >
        ›
      </button>
    </nav>
  );
}
