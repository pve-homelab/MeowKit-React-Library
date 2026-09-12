import clsx from 'clsx';
import { Children, type CSSProperties, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface GridDefinitionItem {
  colspan?: number;
}

export interface GridProps {
  children: ReactNode;
  gridDefinition?: GridDefinitionItem[];
  columns?: number;
  disableGutters?: boolean;
}

type Colspan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

function normalizeColspan(colspan?: number): Colspan {
  if (colspan === undefined || !Number.isFinite(colspan)) {
    return 12;
  }
  const rounded = Math.round(colspan);
  if (rounded <= 1) return 1;
  if (rounded === 2) return 2;
  if (rounded === 3) return 3;
  if (rounded === 4) return 4;
  if (rounded === 5) return 5;
  if (rounded === 6) return 6;
  if (rounded === 7) return 7;
  if (rounded === 8) return 8;
  if (rounded === 9) return 9;
  if (rounded === 10) return 10;
  if (rounded === 11) return 11;
  return 12;
}

function colspanClass(colspan: Colspan) {
  switch (colspan) {
    case 1:
      return styles.colspan1;
    case 2:
      return styles.colspan2;
    case 3:
      return styles.colspan3;
    case 4:
      return styles.colspan4;
    case 5:
      return styles.colspan5;
    case 6:
      return styles.colspan6;
    case 7:
      return styles.colspan7;
    case 8:
      return styles.colspan8;
    case 9:
      return styles.colspan9;
    case 10:
      return styles.colspan10;
    case 11:
      return styles.colspan11;
    case 12:
      return styles.colspan12;
    default: {
      const _exhaustive: never = colspan;
      return _exhaustive;
    }
  }
}

export function InternalGrid({
  children,
  gridDefinition,
  columns,
  disableGutters = false,
}: GridProps) {
  const useEqualColumns = columns !== undefined && gridDefinition === undefined;

  return (
    <div
      className={clsx(
        styles.root,
        useEqualColumns ? styles.equal : styles.twelve,
        disableGutters ? styles.noGutters : styles.gutters,
      )}
      style={
        useEqualColumns
          ? ({ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } satisfies CSSProperties)
          : undefined
      }
    >
      {Children.map(children, (child, index) => (
        <div
          className={clsx(
            styles.cell,
            useEqualColumns ? undefined : colspanClass(normalizeColspan(gridDefinition?.[index]?.colspan)),
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
