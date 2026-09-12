import clsx from 'clsx';
import { forwardRef, useRef, type InputHTMLAttributes } from 'react';
import chrome from '../shared/field-chrome.module.css';
import styles from './styles.module.css';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  invalid?: boolean;
  onClear?: () => void;
  type?: 'search';
}

export const InternalSearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function InternalSearchInput(
    { className, invalid, onClear, type = 'search', disabled, ...rest },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    function assignRef(node: HTMLInputElement | null) {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }

    function handleClear() {
      if (rest.value === undefined && inputRef.current) {
        inputRef.current.value = '';
      }
      onClear?.();
    }

    return (
      <div className={styles.root}>
        <input
          {...rest}
          ref={assignRef}
          type={type}
          disabled={disabled}
          aria-invalid={invalid ? true : rest['aria-invalid']}
          className={clsx(chrome.field, invalid && chrome.invalid, className)}
        />
        {onClear ? (
          <button
            type="button"
            className={styles.clear}
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear"
          >
            ×
          </button>
        ) : null}
      </div>
    );
  },
);
