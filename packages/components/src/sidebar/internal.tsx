import clsx from 'clsx';
import { useState, type CSSProperties, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface SidebarProps {
  children: ReactNode;
  header?: ReactNode;
  width?: number | string;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

function resolveWidth(width?: number | string): string | undefined {
  if (width == null) {
    return undefined;
  }
  return typeof width === 'number' ? `${width}px` : width;
}

export function InternalSidebar({
  children,
  header,
  width,
  collapsible = false,
  collapsed,
  onCollapseChange,
}: SidebarProps) {
  const isControlled = collapsed !== undefined;
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(false);
  const isCollapsed = isControlled ? collapsed : uncontrolledCollapsed;

  function toggle() {
    const next = !isCollapsed;
    if (!isControlled) {
      setUncontrolledCollapsed(next);
    }
    onCollapseChange?.(next);
  }

  const resolvedWidth = isCollapsed ? undefined : resolveWidth(width);
  const style: CSSProperties | undefined = resolvedWidth ? { width: resolvedWidth } : undefined;
  const hasHeader = header != null && header !== false;

  return (
    <aside
      className={clsx(styles.root, isCollapsed && styles.collapsed)}
      data-collapsed={isCollapsed ? 'true' : 'false'}
      style={style}
    >
      {hasHeader || collapsible ? (
        <div className={styles.header}>
          {hasHeader ? <div className={styles.headerContent}>{header}</div> : null}
          {collapsible ? (
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={toggle}
            >
              {isCollapsed ? '›' : '‹'}
            </button>
          ) : null}
        </div>
      ) : null}
      <div className={styles.body} hidden={isCollapsed}>
        {children}
      </div>
    </aside>
  );
}
