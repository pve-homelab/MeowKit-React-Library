import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';
import chrome from '../shared/field-chrome.module.css';
import styles from './styles.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const InternalInput = forwardRef<HTMLInputElement, InputProps>(function InternalInput(
  { className, invalid, type = 'text', ...rest },
  ref,
) {
  return (
    <input
      {...rest}
      ref={ref}
      type={type}
      aria-invalid={invalid ? true : rest['aria-invalid']}
      className={clsx(chrome.field, styles.field, invalid && chrome.invalid, className)}
    />
  );
});
