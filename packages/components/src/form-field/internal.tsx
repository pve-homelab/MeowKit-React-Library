import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface FormFieldProps {
  label?: ReactNode;
  description?: ReactNode;
  errorText?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

export function InternalFormField({
  label,
  description,
  errorText,
  children,
  htmlFor,
  className,
}: FormFieldProps) {
  return (
    <div className={clsx(styles.root, className)}>
      {label != null && label !== false ? (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {description != null && description !== false ? (
        <div className={styles.description}>{description}</div>
      ) : null}
      {children}
      {errorText != null && errorText !== false ? (
        <div className={styles.error}>{errorText}</div>
      ) : null}
    </div>
  );
}
