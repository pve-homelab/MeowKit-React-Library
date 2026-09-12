import clsx from 'clsx';
import { forwardRef, type TextareaHTMLAttributes } from 'react';
import chrome from '../shared/field-chrome.module.css';
import styles from './styles.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const InternalTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function InternalTextarea({ className, invalid, ...rest }, ref) {
    return (
      <textarea
        {...rest}
        ref={ref}
        aria-invalid={invalid ? true : rest['aria-invalid']}
        className={clsx(chrome.field, styles.field, invalid && chrome.invalid, className)}
      />
    );
  },
);
