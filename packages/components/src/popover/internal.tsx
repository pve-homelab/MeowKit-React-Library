import * as PopoverPrimitive from '@radix-ui/react-popover';
import clsx from 'clsx';
import { isValidElement, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function InternalPopover({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: PopoverProps) {
  return (
    <PopoverPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {isValidElement(children) ? (
        <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      ) : (
        <PopoverPrimitive.Trigger>{children}</PopoverPrimitive.Trigger>
      )}
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={clsx(styles.content, className)}
          sideOffset={4}
          avoidCollisions={false}
          aria-describedby={undefined}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
