import * as SwitchPrimitive from '@radix-ui/react-switch';
import clsx from 'clsx';
import { useId, type ReactElement, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

function hasTextName(node: ReactNode): boolean {
  if (node == null || typeof node === 'boolean') {
    return false;
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).trim() !== '';
  }
  if (Array.isArray(node)) {
    return node.some(hasTextName);
  }
  if (typeof node === 'object' && 'props' in node) {
    return hasTextName((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return false;
}

function hasAccessibleName(
  children: ReactNode,
  ariaLabel: SwitchProps['aria-label'],
  ariaLabelledBy: SwitchProps['aria-labelledby'],
): boolean {
  if (typeof ariaLabel === 'string' && ariaLabel.trim() !== '') {
    return true;
  }
  if (typeof ariaLabelledBy === 'string' && ariaLabelledBy.trim() !== '') {
    return true;
  }
  return hasTextName(children);
}

export function InternalSwitch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  children,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SwitchProps) {
  const generatedId = useId();

  if (process.env.NODE_ENV !== 'production') {
    if (!hasAccessibleName(children, ariaLabel, ariaLabelledBy)) {
      console.warn(
        'MeowKit Switch: an accessible name is required via aria-label, aria-labelledby, or text content.',
      );
    }
  }

  const hasVisibleLabel = children != null && children !== false;

  return (
    <span className={clsx(styles.root, className)}>
      <SwitchPrimitive.Root
        id={hasVisibleLabel ? generatedId : undefined}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={styles.control}
      >
        <SwitchPrimitive.Thumb className={styles.thumb} />
      </SwitchPrimitive.Root>
      {hasVisibleLabel ? (
        <label className={styles.label} htmlFor={generatedId}>
          {children}
        </label>
      ) : null}
    </span>
  );
}
