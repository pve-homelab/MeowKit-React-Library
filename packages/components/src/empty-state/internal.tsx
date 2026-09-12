import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}

export function InternalEmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className={styles.root}>
      {icon != null && icon !== false ? <div className={styles.icon}>{icon}</div> : null}
      <h2 className={styles.title}>{title}</h2>
      {description != null && description !== false ? (
        <div className={styles.description}>{description}</div>
      ) : null}
      {action != null && action !== false ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
