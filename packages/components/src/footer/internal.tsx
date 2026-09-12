import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface FooterProps {
  children: ReactNode;
}

export function InternalFooter({ children }: FooterProps) {
  return <footer className={styles.root}>{children}</footer>;
}
