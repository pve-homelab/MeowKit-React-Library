import * as SliderPrimitive from '@radix-ui/react-slider';
import clsx from 'clsx';
import { useId, type ReactElement, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

function hasTextName(node: ReactNode): boolean {
  if (node == null || typeof node === 'boolean') {
    return false;
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).trim() !== '';
  }
  if (Array.isArray(node)) {
    return node.some(hasTextName);
  }
  if (typeof node === 'object' && 'props' in node) {
    return hasTextName((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return false;
}

function hasAccessibleName(
  children: ReactNode,
  ariaLabel: SliderProps['aria-label'],
  ariaLabelledBy: SliderProps['aria-labelledby'],
): boolean {
  if (typeof ariaLabel === 'string' && ariaLabel.trim() !== '') {
    return true;
  }
  if (typeof ariaLabelledBy === 'string' && ariaLabelledBy.trim() !== '') {
    return true;
  }
  return hasTextName(children);
}

export function InternalSlider({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step,
  disabled,
  children,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SliderProps) {
  const labelId = useId();
  const thumbCount = (value ?? defaultValue ?? [0]).length;
  const hasVisibleLabel = children != null && children !== false;
  const thumbLabelledBy = hasVisibleLabel ? labelId : ariaLabelledBy;

  if (process.env.NODE_ENV !== 'production') {
    if (!hasAccessibleName(children, ariaLabel, ariaLabelledBy)) {
      console.warn(
        'MeowKit Slider: an accessible name is required via aria-label, aria-labelledby, or text content.',
      );
    }
  }

  return (
    <span className={clsx(styles.root, className)}>
      <SliderPrimitive.Root
        value={value}
        defaultValue={defaultValue ?? (value === undefined ? [0] : undefined)}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={styles.control}
      >
        <SliderPrimitive.Track className={styles.track}>
          <SliderPrimitive.Range className={styles.range} />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }, (_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className={styles.thumb}
            aria-label={ariaLabel}
            aria-labelledby={thumbLabelledBy}
          />
        ))}
      </SliderPrimitive.Root>
      {hasVisibleLabel ? (
        <label className={styles.label} id={labelId}>
          {children}
        </label>
      ) : null}
    </span>
  );
}
