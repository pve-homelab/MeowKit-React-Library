import clsx from 'clsx';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Alert, { type AlertType } from '../alert';
import { useFlashbar } from './context';
import styles from './styles.module.css';

export interface FlashbarItem {
  id: string;
  type?: AlertType;
  content: ReactNode;
  header?: ReactNode;
  dismissible?: boolean;
}

export interface FlashbarProps {
  items: FlashbarItem[];
  onDismiss?: (id: string) => void;
  className?: string;
}

export function InternalFlashbar({ items, onDismiss, className }: FlashbarProps) {
  return (
    <div className={clsx(styles.root, className)}>
      {items.map((item) => (
        <Alert
          key={item.id}
          type={item.type}
          header={item.header}
          dismissible={item.dismissible}
          onDismiss={() => onDismiss?.(item.id)}
        >
          {item.content}
        </Alert>
      ))}
    </div>
  );
}

export function FlashbarHost() {
  const { items, dismiss } = useFlashbar();

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className={styles.host}
      data-mk-flashbar-host=""
      style={{ position: 'fixed', zIndex: 'var(--mk-z-toast)' }}
    >
      <InternalFlashbar items={items} onDismiss={dismiss} />
    </div>,
    document.body,
  );
}
