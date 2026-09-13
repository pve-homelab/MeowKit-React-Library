import clsx from 'clsx';
import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactNode,
} from 'react';
import styles from './styles.module.css';

export interface FormFieldProps {
  label?: ReactNode;
  description?: ReactNode;
  errorText?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

function hasContent(value: ReactNode): boolean {
  return value != null && value !== false;
}

function mergeDescribedBy(...parts: Array<string | undefined>): string | undefined {
  const ids = parts.flatMap((part) => (part ? part.split(/\s+/) : [])).filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export function InternalFormField({
  label,
  description,
  errorText,
  children,
  htmlFor,
  className,
}: FormFieldProps) {
  const uid = useId();
  const descriptionId = hasContent(description) ? `${uid}-description` : undefined;
  const errorId = hasContent(errorText) ? `${uid}-error` : undefined;
  const fieldDescribedBy = mergeDescribedBy(descriptionId, errorId);

  const childArray = Children.toArray(children);
  const onlyChild = childArray.length === 1 ? childArray[0] : undefined;
  const control =
    fieldDescribedBy && isValidElement<{ 'aria-describedby'?: string }>(onlyChild)
      ? cloneElement(onlyChild, {
          'aria-describedby': mergeDescribedBy(onlyChild.props['aria-describedby'], fieldDescribedBy),
        })
      : children;

  return (
    <div className={clsx(styles.root, className)}>
      {hasContent(label) ? (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {hasContent(description) ? (
        <div id={descriptionId} className={styles.description}>
          {description}
        </div>
      ) : null}
      {control}
      {hasContent(errorText) ? (
        <div id={errorId} className={styles.error}>
          {errorText}
        </div>
      ) : null}
    </div>
  );
}
