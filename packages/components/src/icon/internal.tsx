import clsx from 'clsx';
import { iconMap, type IconName } from './glyphs';
import styles from './styles.module.css';

export type { IconName } from './glyphs';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}

export function InternalIcon({
  name,
  size = 'md',
  className,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
}: IconProps) {
  const Glyph = iconMap[name];
  const labelled = typeof ariaLabel === 'string' && ariaLabel !== '';

  return (
    <span className={clsx(styles.root, styles[size], className)}>
      <Glyph
        data-icon={name}
        aria-hidden={labelled ? undefined : (ariaHidden ?? true)}
        aria-label={labelled ? ariaLabel : undefined}
        role={labelled ? 'img' : undefined}
      />
    </span>
  );
}
