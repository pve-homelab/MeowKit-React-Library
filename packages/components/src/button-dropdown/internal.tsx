import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Button, type ButtonVariant } from '../button';
import styles from './styles.module.css';

export interface ButtonDropdownItem {
  id: string;
  text: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}

export interface ButtonDropdownProps {
  items: ButtonDropdownItem[];
  onItemClick?: (id: string) => void;
  variant?: ButtonVariant;
  children: ReactNode;
  disabled?: boolean;
}

export function InternalButtonDropdown({
  items,
  onItemClick,
  variant,
  children,
  disabled,
}: ButtonDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant={variant} disabled={disabled}>
          {children}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.content} sideOffset={4} avoidCollisions={false}>
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.id}
              disabled={item.disabled}
              className={clsx(styles.item, item.destructive && styles.destructive)}
              onSelect={() => onItemClick?.(item.id)}
            >
              {item.text}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
