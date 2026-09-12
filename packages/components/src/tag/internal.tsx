import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface TagProps {
  children?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

export function InternalTag({
  children,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
}: TagProps) {
  return (
    <span className={clsx(styles.root, className)}>
      <span className={styles.label}>{children}</span>
      {onDismiss ? (
        <button type="button" className={styles.dismiss} aria-label={dismissLabel} onClick={onDismiss}>
          ×
        </button>
      ) : null}
    </span>
  );
}
