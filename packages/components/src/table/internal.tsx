import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import styles from './styles.module.css';

export interface TableColumnDefinition<T> {
  id: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  sortingField?: string;
  width?: number | string;
}

export interface TableSortingState {
  sortingColumn: string;
  sortingDescending: boolean;
}

export interface TableProps<T> {
  items: T[];
  columnDefinitions: TableColumnDefinition<T>[];
  sortingColumn?: string;
  sortingDescending?: boolean;
  onSortingChange?: (state: TableSortingState) => void;
  empty?: ReactNode;
  loading?: boolean;
  variant?: 'container' | 'embedded';
}

function columnWidth(width?: number | string): CSSProperties | undefined {
  if (width == null) {
    return undefined;
  }
  return { width: typeof width === 'number' ? `${width}px` : width };
}

function variantClass(variant: 'container' | 'embedded') {
  switch (variant) {
    case 'container':
      return styles.container;
    case 'embedded':
      return styles.embedded;
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

function headerSort(columnId: string, sortingColumn?: string, sortingDescending?: boolean) {
  if (sortingColumn !== columnId) {
    return 'none' as const;
  }
  return sortingDescending ? ('descending' as const) : ('ascending' as const);
}

export function InternalTable<T>({
  items,
  columnDefinitions,
  sortingColumn,
  sortingDescending = false,
  onSortingChange,
  empty,
  loading = false,
  variant = 'container',
}: TableProps<T>) {
  const showEmpty = !loading && items.length === 0 && empty != null && empty !== false;

  function handleSort(columnId: string) {
    if (!onSortingChange) {
      return;
    }
    if (sortingColumn === columnId) {
      onSortingChange({ sortingColumn: columnId, sortingDescending: !sortingDescending });
      return;
    }
    onSortingChange({ sortingColumn: columnId, sortingDescending: false });
  }

  return (
    <div className={clsx(styles.root, variantClass(variant))} data-variant={variant}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columnDefinitions.map((column) => {
              const sortable = Boolean(column.sortingField);
              return (
                <th
                  key={column.id}
                  scope="col"
                  className={styles.header}
                  aria-sort={sortable ? headerSort(column.id, sortingColumn, sortingDescending) : undefined}
                  style={columnWidth(column.width)}
                >
                  {sortable ? (
                    <button type="button" className={styles.sortButton} onClick={() => handleSort(column.id)}>
                      {column.header}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              {columnDefinitions.map((column) => (
                <td key={column.id} className={styles.cell} style={columnWidth(column.width)}>
                  {column.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {loading ? (
        <div className={styles.loading} role="status" aria-label="Loading">
          Loading
        </div>
      ) : null}
      {showEmpty ? <div className={styles.empty}>{empty}</div> : null}
    </div>
  );
}
