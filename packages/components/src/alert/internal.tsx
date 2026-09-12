import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  type?: AlertType;
  header?: ReactNode;
  children?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: ReactNode;
  className?: string;
}

function alertRole(type: AlertType): 'alert' | 'status' {
  switch (type) {
    case 'error':
    case 'warning':
      return 'alert';
    case 'info':
    case 'success':
      return 'status';
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function InternalAlert({
  type = 'info',
  header,
  children,
  dismissible = false,
  onDismiss,
  action,
  className,
}: AlertProps) {
  return (
    <div role={alertRole(type)} className={clsx(styles.root, styles[type], className)}>
      <div className={styles.body}>
        {header != null && header !== false ? <div className={styles.header}>{header}</div> : null}
        {children != null && children !== false ? <div className={styles.content}>{children}</div> : null}
      </div>
      {action != null && action !== false ? <div className={styles.action}>{action}</div> : null}
      {dismissible ? (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
          ×
        </button>
      ) : null}
    </div>
  );
}
