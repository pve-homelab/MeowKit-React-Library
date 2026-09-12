import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';
import chrome from '../shared/field-chrome.module.css';
import styles from './styles.module.css';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type'> {
  value?: number | '';
  defaultValue?: number | '';
  onChange?: (value: number | '') => void;
  invalid?: boolean;
}

function toInputString(value: number | '' | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return value === '' ? '' : String(value);
}

function parseInputValue(raw: string): number | '' {
  if (raw === '') {
    return '';
  }
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? '' : parsed;
}

export const InternalNumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function InternalNumberInput(
    { className, invalid, value, defaultValue, onChange, ...rest },
    ref,
  ) {
    const isControlled = value !== undefined;

    return (
      <input
        {...rest}
        ref={ref}
        type="number"
        value={isControlled ? toInputString(value) : undefined}
        defaultValue={isControlled ? undefined : toInputString(defaultValue)}
        aria-invalid={invalid ? true : rest['aria-invalid']}
        className={clsx(chrome.field, styles.field, invalid && chrome.invalid, className)}
        onChange={(event) => {
          onChange?.(parseInputValue(event.target.value));
        }}
      />
    );
  },
);
