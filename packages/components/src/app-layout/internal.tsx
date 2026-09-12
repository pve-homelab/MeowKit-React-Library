import clsx from 'clsx';
import { useState, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface AppLayoutProps {
  navigation?: ReactNode;
  navigationOpen?: boolean;
  onNavigationChange?: (open: boolean) => void;
  tools?: ReactNode;
  toolsOpen?: boolean;
  onToolsChange?: (open: boolean) => void;
  content: ReactNode;
  contentHeader?: ReactNode;
  notifications?: ReactNode;
  statusBar?: ReactNode;
  stickyNotifications?: boolean;
}

function hasSlot(value: ReactNode): boolean {
  return value != null && value !== false;
}

export function InternalAppLayout({
  navigation,
  navigationOpen,
  onNavigationChange,
  tools,
  toolsOpen,
  onToolsChange,
  content,
  contentHeader,
  notifications,
  statusBar,
  stickyNotifications = false,
}: AppLayoutProps) {
  const hasNavigation = hasSlot(navigation);
  const hasTools = hasSlot(tools);
  const navigationControlled = navigationOpen !== undefined;
  const toolsControlled = toolsOpen !== undefined;
  const [uncontrolledNavigationOpen, setUncontrolledNavigationOpen] = useState(true);
  const [uncontrolledToolsOpen, setUncontrolledToolsOpen] = useState(false);
  const isNavigationOpen = hasNavigation && (navigationControlled ? navigationOpen : uncontrolledNavigationOpen);
  const isToolsOpen = hasTools && (toolsControlled ? toolsOpen : uncontrolledToolsOpen);

  function toggleNavigation() {
    const next = !isNavigationOpen;
    if (!navigationControlled) {
      setUncontrolledNavigationOpen(next);
    }
    onNavigationChange?.(next);
  }

  function toggleTools() {
    const next = !isToolsOpen;
    if (!toolsControlled) {
      setUncontrolledToolsOpen(next);
    }
    onToolsChange?.(next);
  }

  return (
    <div className={styles.root}>
      {hasNavigation || hasTools ? (
        <div className={styles.chrome}>
          {hasNavigation ? (
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={isNavigationOpen}
              aria-label={isNavigationOpen ? 'Close navigation' : 'Open navigation'}
              onClick={toggleNavigation}
            >
              {isNavigationOpen ? '‹' : '›'}
            </button>
          ) : null}
          {hasTools ? (
            <button
              type="button"
              className={clsx(styles.toggle, styles.toolsToggle)}
              aria-expanded={isToolsOpen}
              aria-label={isToolsOpen ? 'Close tools' : 'Open tools'}
              onClick={toggleTools}
            >
              {isToolsOpen ? '›' : '‹'}
            </button>
          ) : null}
        </div>
      ) : null}
      <div className={styles.body}>
        {hasNavigation ? (
          <aside
            className={styles.navigation}
            aria-label="Navigation"
            hidden={!isNavigationOpen}
            data-open={isNavigationOpen ? 'true' : 'false'}
          >
            {navigation}
          </aside>
        ) : null}
        <main className={styles.main}>
          {hasSlot(notifications) ? (
            <div
              className={clsx(styles.notifications, stickyNotifications && styles.stickyNotifications)}
              data-sticky={stickyNotifications ? 'true' : 'false'}
            >
              {notifications}
            </div>
          ) : null}
          {hasSlot(contentHeader) ? <div className={styles.contentHeader}>{contentHeader}</div> : null}
          <div className={styles.content}>{content}</div>
        </main>
        {hasTools ? (
          <aside
            className={styles.tools}
            aria-label="Tools"
            hidden={!isToolsOpen}
            data-open={isToolsOpen ? 'true' : 'false'}
          >
            {tools}
          </aside>
        ) : null}
      </div>
      {hasSlot(statusBar) ? <div className={styles.statusBar}>{statusBar}</div> : null}
    </div>
  );
}
