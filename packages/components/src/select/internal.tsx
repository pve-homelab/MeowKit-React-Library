import * as SelectPrimitive from '@radix-ui/react-select';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import chrome from '../shared/field-chrome.module.css';
import styles from './styles.module.css';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export function InternalSelect({
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  invalid,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        className={clsx(chrome.field, styles.trigger, invalid && chrome.invalid, className)}
        aria-invalid={invalid ? true : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className={styles.icon} aria-hidden>
          ▾
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className={styles.content}>
          <SelectPrimitive.Viewport className={styles.viewport}>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={styles.item}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
