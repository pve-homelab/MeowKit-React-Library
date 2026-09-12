import clsx from 'clsx';
import { createElement, type ReactNode } from 'react';
import styles from './styles.module.css';

export type HeaderVariant = 'h1' | 'h2' | 'h3' | 'h4';

export interface HeaderProps {
  variant?: HeaderVariant;
  children: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  counter?: ReactNode;
}

function headingClass(variant: HeaderVariant) {
  switch (variant) {
    case 'h1':
      return styles.headingH1;
    case 'h2':
      return styles.headingH2;
    case 'h3':
      return styles.headingH3;
    case 'h4':
      return styles.headingH4;
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export function InternalHeader({
  variant = 'h2',
  children,
  description,
  actions,
  counter,
}: HeaderProps) {
  return (
    <div className={styles.root}>
      <div className={styles.main}>
        {createElement(
          variant,
          { className: clsx(styles.heading, headingClass(variant)) },
          children,
          counter != null && counter !== false ? (
            <span className={styles.counter}>{counter}</span>
          ) : null,
        )}
        {actions != null && actions !== false ? <div className={styles.actions}>{actions}</div> : null}
      </div>
      {description != null && description !== false ? (
        <div className={styles.description}>{description}</div>
      ) : null}
    </div>
  );
}
