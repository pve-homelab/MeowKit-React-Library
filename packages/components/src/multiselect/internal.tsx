import clsx from 'clsx';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '../button';
import chrome from '../shared/field-chrome.module.css';
import { Tag } from '../tag';
import styles from './styles.module.css';

export interface MultiselectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface MultiselectProps {
  options: MultiselectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  tokenLimit?: number;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

function optionLabel(options: MultiselectOption[], value: string): ReactNode {
  return options.find((option) => option.value === value)?.label ?? value;
}

function dismissLabelFor(options: MultiselectOption[], value: string): string {
  const label = optionLabel(options, value);
  return typeof label === 'string' || typeof label === 'number' ? `Remove ${label}` : `Remove ${value}`;
}

export function InternalMultiselect({
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  invalid,
  tokenLimit,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: MultiselectProps) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultValue ?? []);
  const selected = isControlled ? value : uncontrolled;
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  function commit(next: string[]) {
    if (!isControlled) {
      setUncontrolled(next);
    }
    onChange?.(next);
  }

  function toggle(optionValue: string) {
    const option = options.find((item) => item.value === optionValue);
    if (!option || option.disabled) {
      return;
    }
    commit(
      selected.includes(optionValue)
        ? selected.filter((item) => item !== optionValue)
        : [...selected, optionValue],
    );
  }

  function dismiss(optionValue: string) {
    commit(selected.filter((item) => item !== optionValue));
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const enabledIndexes = options
    .map((option, index) => (option.disabled ? -1 : index))
    .filter((index) => index >= 0);

  function moveHighlight(delta: number) {
    if (enabledIndexes.length === 0) {
      return;
    }
    const currentPos = enabledIndexes.indexOf(highlighted);
    const nextPos =
      currentPos === -1
        ? delta > 0
          ? 0
          : enabledIndexes.length - 1
        : (currentPos + delta + enabledIndexes.length) % enabledIndexes.length;
    setHighlighted(enabledIndexes[nextPos] ?? enabledIndexes[0] ?? 0);
  }

  function handleComboboxKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlighted(enabledIndexes[0] ?? 0);
        } else {
          moveHighlight(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlighted(enabledIndexes[enabledIndexes.length - 1] ?? 0);
        } else {
          moveHighlight(-1);
        }
        break;
      case 'Enter':
      case ' ':
        if (open) {
          event.preventDefault();
          const option = options[highlighted];
          if (option) {
            toggle(option.value);
          }
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
    }
  }

  const visibleValues = tokenLimit == null ? selected : selected.slice(0, tokenLimit);
  const overflow = tokenLimit == null ? 0 : Math.max(0, selected.length - tokenLimit);
  const highlightedOption = options[highlighted];
  const activeDescendant = open && highlightedOption ? `${listboxId}-${highlightedOption.value}` : undefined;

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={clsx(chrome.field, styles.field, invalid && chrome.invalid, className)}>
        <div
          className={styles.tokens}
          onClick={() => {
            if (!disabled) {
              setOpen(true);
            }
          }}
        >
          {visibleValues.map((item) => (
            <span
              key={item}
              className={styles.chip}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Tag
                onDismiss={disabled ? undefined : () => dismiss(item)}
                dismissLabel={dismissLabelFor(options, item)}
              >
                {optionLabel(options, item)}
              </Tag>
            </span>
          ))}
          {overflow > 0 ? <span className={styles.overflow}>+{overflow}</span> : null}
          {selected.length === 0 && placeholder ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : null}
        </div>
        <Button
          variant="icon"
          className={styles.toggle}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={activeDescendant}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={invalid ? true : undefined}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={handleComboboxKeyDown}
        >
          <span aria-hidden>▾</span>
        </Button>
      </div>
      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-label={ariaLabel}
          className={styles.listbox}
        >
          {options.map((option, index) => {
            const isSelected = selected.includes(option.value);
            return (
              <li
                key={option.value}
                id={`${listboxId}-${option.value}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled ? true : undefined}
                data-highlighted={highlighted === index ? 'true' : undefined}
                className={styles.option}
                onMouseEnter={() => {
                  if (!option.disabled) {
                    setHighlighted(index);
                  }
                }}
                onClick={() => toggle(option.value)}
              >
                <span className={styles.check} aria-hidden>
                  {isSelected ? '✓' : ''}
                </span>
                {option.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
