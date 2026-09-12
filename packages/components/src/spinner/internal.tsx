import clsx from 'clsx';
import styles from './styles.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  'aria-label'?: string;
  className?: string;
}

export function InternalSpinner({
  size = 'md',
  'aria-label': ariaLabel = 'Loading',
  className,
}: SpinnerProps) {
  return (
    <span role="status" aria-label={ariaLabel} className={clsx(styles.root, styles[size], className)}>
      <span className={styles.circle} aria-hidden="true" />
    </span>
  );
}
