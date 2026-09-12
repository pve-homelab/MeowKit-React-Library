import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export type DrawerPosition = 'left' | 'right';

export interface DrawerProps {
  visible: boolean;
  onDismiss: () => void;
  header?: ReactNode;
  children?: ReactNode;
  position?: DrawerPosition;
  className?: string;
}

function positionClass(position: DrawerPosition): string | undefined {
  switch (position) {
    case 'left':
      return styles.left;
    case 'right':
      return styles.right;
    default: {
      const _exhaustive: never = position;
      return _exhaustive;
    }
  }
}

export function InternalDrawer({
  visible,
  onDismiss,
  header,
  children,
  position = 'right',
  className,
}: DrawerProps) {
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
        <Dialog.Content
          className={clsx(styles.content, positionClass(position), className)}
          data-position={position}
          aria-describedby={undefined}
        >
          {hasHeader ? (
            <Dialog.Title className={styles.header}>{header}</Dialog.Title>
          ) : (
            <Dialog.Title className={styles.visuallyHidden}>Drawer</Dialog.Title>
          )}
          {children != null && children !== false ? <div className={styles.body}>{children}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
