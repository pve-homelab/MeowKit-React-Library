import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export type ColumnLayoutVariant = 'default' | 'text-grid';

export interface ColumnLayoutProps {
  children: ReactNode;
  columns?: number;
  variant?: ColumnLayoutVariant;
}

function columnsClass(columns: number) {
  switch (columns) {
    case 1:
      return styles.columns1;
    case 2:
      return styles.columns2;
    case 3:
      return styles.columns3;
    case 4:
      return styles.columns4;
    default:
      return styles.columns1;
  }
}

function variantClass(variant: ColumnLayoutVariant) {
  switch (variant) {
    case 'default':
      return styles.variantDefault;
    case 'text-grid':
      return styles.variantTextGrid;
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export function InternalColumnLayout({
  children,
  columns = 1,
  variant = 'default',
}: ColumnLayoutProps) {
  return (
    <div className={clsx(styles.root, columnsClass(columns), variantClass(variant))}>{children}</div>
  );
}
