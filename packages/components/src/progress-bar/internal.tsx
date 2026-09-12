import clsx from 'clsx';
import { useId, type CSSProperties, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function InternalProgressBar({
  value,
  max = 100,
  label,
  description,
  className,
}: ProgressBarProps) {
  const labelId = useId();
  const descriptionId = useId();
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percent = (clamped / safeMax) * 100;
  const hasLabel = label != null && label !== false;
  const hasDescription = description != null && description !== false;

  return (
    <div className={clsx(styles.root, className)}>
      {hasLabel ? (
        <div id={labelId} className={styles.label}>
          {label}
        </div>
      ) : null}
      {hasDescription ? (
        <div id={descriptionId} className={styles.description}>
          {description}
        </div>
      ) : null}
      <div
        role="progressbar"
        className={styles.track}
        aria-valuemin={0}
        aria-valuenow={value}
        aria-valuemax={safeMax}
        aria-labelledby={hasLabel ? labelId : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
      >
        <div
          className={styles.fill}
          style={{ '--mk-progress-value': `${percent}%` } as CSSProperties}
        />
      </div>
    </div>
  );
}
