import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export type ContainerVariant = 'default' | 'stacked';

export interface ContainerProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  disableContentPaddings?: boolean;
  variant?: ContainerVariant;
}

function variantClass(variant: ContainerVariant) {
  switch (variant) {
    case 'default':
      return styles.default;
    case 'stacked':
      return styles.stacked;
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export function InternalContainer({
  header,
  footer,
  children,
  disableContentPaddings = false,
  variant = 'default',
}: ContainerProps) {
  return (
    <div className={clsx(styles.root, variantClass(variant))}>
      {header != null && header !== false ? <div className={styles.header}>{header}</div> : null}
      <div className={clsx(styles.content, disableContentPaddings ? styles.contentFlush : styles.contentPadded)}>
        {children}
      </div>
      {footer != null && footer !== false ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
}
