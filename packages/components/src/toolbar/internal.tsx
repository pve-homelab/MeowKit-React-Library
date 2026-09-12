import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface ToolbarProps {
  children: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}

export function InternalToolbar({ children, left, right }: ToolbarProps) {
  return (
    <div role="toolbar" className={styles.root}>
      {left != null && left !== false ? <div className={styles.left}>{left}</div> : null}
      <div className={styles.main}>{children}</div>
      {right != null && right !== false ? <div className={styles.right}>{right}</div> : null}
    </div>
  );
}
