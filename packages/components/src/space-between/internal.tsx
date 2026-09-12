import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export type SpaceBetweenDirection = 'vertical' | 'horizontal';
export type SpaceBetweenSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface SpaceBetweenProps {
  children: ReactNode;
  direction?: SpaceBetweenDirection;
  size?: SpaceBetweenSize;
}

function directionClass(direction: SpaceBetweenDirection) {
  switch (direction) {
    case 'vertical':
      return styles.vertical;
    case 'horizontal':
      return styles.horizontal;
    default: {
      const _exhaustive: never = direction;
      return _exhaustive;
    }
  }
}

function sizeClass(size: SpaceBetweenSize) {
  switch (size) {
    case 'xs':
      return styles.sizeXs;
    case 's':
      return styles.sizeS;
    case 'm':
      return styles.sizeM;
    case 'l':
      return styles.sizeL;
    case 'xl':
      return styles.sizeXl;
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export function InternalSpaceBetween({
  children,
  direction = 'vertical',
  size = 'm',
}: SpaceBetweenProps) {
  return (
    <div className={clsx(styles.root, directionClass(direction), sizeClass(size))}>{children}</div>
  );
}
