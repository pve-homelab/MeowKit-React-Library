import clsx from 'clsx';
import { useState, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function InternalSegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  className,
}: SegmentedControlProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selected = isControlled ? value : uncontrolledValue;

  function select(next: string) {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next);
  }

  return (
    <div role="radiogroup" className={clsx(styles.root, className)}>
      {options.map((option) => {
        const checked = selected === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={option.disabled}
            className={styles.segment}
            onClick={() => {
              select(option.value);
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
