import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface StatusBarProps {
  children: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}

export function InternalStatusBar({ children, left, right }: StatusBarProps) {
  return (
    <div role="status" className={styles.root}>
      {left != null && left !== false ? <div className={styles.left}>{left}</div> : null}
      <div className={styles.main}>{children}</div>
      {right != null && right !== false ? <div className={styles.right}>{right}</div> : null}
    </div>
  );
}
