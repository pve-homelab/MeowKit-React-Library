import clsx from 'clsx';
import { useId, type ChangeEvent, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface RadioGroupItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  items: RadioGroupItem[];
  name?: string;
  disabled?: boolean;
  className?: string;
}

export function InternalRadioGroup({
  value,
  defaultValue,
  onChange,
  items,
  name,
  disabled,
  className,
}: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;

  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event.target.value);
  }

  return (
    <div role="radiogroup" className={clsx(styles.root, className)}>
      {items.map((item) => {
        const itemDisabled = Boolean(disabled || item.disabled);
        return (
          <label key={item.value} className={styles.item}>
            <input
              type="radio"
              className={styles.control}
              name={groupName}
              value={item.value}
              checked={isControlled ? value === item.value : undefined}
              defaultChecked={!isControlled && defaultValue === item.value ? true : undefined}
              disabled={itemDisabled}
              onChange={handleChange}
            />
            <span className={styles.label}>{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}
