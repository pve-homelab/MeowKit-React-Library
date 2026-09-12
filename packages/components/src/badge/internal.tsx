import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export type BadgeColor = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  children?: ReactNode;
  color?: BadgeColor;
  className?: string;
}

export function InternalBadge({ children, color = 'default', className }: BadgeProps) {
  return <span className={clsx(styles.root, styles[color], className)}>{children}</span>;
}
