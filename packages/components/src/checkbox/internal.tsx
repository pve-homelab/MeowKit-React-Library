import clsx from 'clsx';
import { useEffect, useRef, type ChangeEvent, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

export function InternalCheckbox({
  checked,
  defaultChecked,
  onChange,
  indeterminate,
  disabled,
  children,
  className,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event.target.checked);
  }

  return (
    <label className={clsx(styles.root, className)}>
      <input
        ref={inputRef}
        type="checkbox"
        className={styles.control}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
      />
      {children != null && children !== false ? <span className={styles.label}>{children}</span> : null}
    </label>
  );
}
