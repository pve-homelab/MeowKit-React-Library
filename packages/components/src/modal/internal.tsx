import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  visible: boolean;
  onDismiss: () => void;
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  className?: string;
}

function sizeClass(size: ModalSize): string | undefined {
  switch (size) {
    case 'sm':
      return styles.sm;
    case 'md':
      return styles.md;
    case 'lg':
      return styles.lg;
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export function InternalModal({
  visible,
  onDismiss,
  header,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  const hasHeader = header != null && header !== false;

  return (
    <Dialog.Root
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          onDismiss();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={clsx(styles.content, sizeClass(size), className)} aria-describedby={undefined}>
          {hasHeader ? (
            <Dialog.Title className={styles.header}>{header}</Dialog.Title>
          ) : (
            <Dialog.Title className={styles.visuallyHidden}>Dialog</Dialog.Title>
          )}
          {children != null && children !== false ? <div className={styles.body}>{children}</div> : null}
          {footer != null && footer !== false ? <div className={styles.footer}>{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
