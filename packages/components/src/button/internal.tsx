import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import styles from './styles.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: ReactNode;
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
  ariaLabel: ButtonProps['aria-label'],
  ariaLabelledBy: ButtonProps['aria-labelledby'],
): boolean {
  if (typeof ariaLabel === 'string' && ariaLabel.trim() !== '') {
    return true;
  }
  if (typeof ariaLabelledBy === 'string' && ariaLabelledBy.trim() !== '') {
    return true;
  }
  return hasTextName(children);
}

export const InternalButton = forwardRef<HTMLButtonElement, ButtonProps>(function InternalButton(
  { variant = 'primary', className, type = 'button', children, ...rest },
  ref,
) {
  if (process.env.NODE_ENV !== 'production' && variant === 'icon') {
    if (!hasAccessibleName(children, rest['aria-label'], rest['aria-labelledby'])) {
      console.warn(
        'MeowKit Button: variant="icon" requires an accessible name via aria-label, aria-labelledby, or text content.',
      );
    }
  }

  return (
    <button
      ref={ref}
      type={type}
      className={clsx(styles.root, styles[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
});
