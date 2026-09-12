import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface KeyValuePair {
  label: ReactNode;
  value: ReactNode;
}

export interface KeyValuePairsProps {
  items: KeyValuePair[];
  columns?: number;
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

export function InternalKeyValuePairs({ items, columns = 1 }: KeyValuePairsProps) {
  return (
    <dl className={clsx(styles.root, columnsClass(columns))}>
      {items.map((item, index) => (
        <div key={index} className={styles.item}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
