import clsx from 'clsx';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import styles from './styles.module.css';

export type LinkVariant = 'primary' | 'secondary';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
}

export const InternalLink = forwardRef<HTMLAnchorElement, LinkProps>(function InternalLink(
  { variant = 'primary', className, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={clsx(styles.root, styles[variant], className)} {...rest}>
      {children}
    </a>
  );
});
