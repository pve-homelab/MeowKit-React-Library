import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface BreadcrumbItem {
  text: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function InternalBreadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.root}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={index} className={styles.item}>
              {index > 0 ? (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              ) : null}
              {renderItem(item, isCurrent)}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function renderItem(item: BreadcrumbItem, isCurrent: boolean) {
  if (isCurrent) {
    return (
      <span className={styles.current} aria-current="page">
        {item.text}
      </span>
    );
  }

  if (item.href != null) {
    return (
      <a className={styles.link} href={item.href} onClick={item.onClick}>
        {item.text}
      </a>
    );
  }

  if (item.onClick) {
    return (
      <button type="button" className={styles.link} onClick={item.onClick}>
        {item.text}
      </button>
    );
  }

  return <span className={styles.text}>{item.text}</span>;
}
