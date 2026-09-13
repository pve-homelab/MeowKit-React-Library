import clsx from 'clsx';
import type { ReactNode } from 'react';
import Badge from '../badge';
import Button from '../button';
import Container from '../container';
import EmptyState from '../empty-state';
import Header from '../header';
import SpaceBetween from '../space-between';
import styles from './styles.module.css';

export interface MarketplaceApp {
  id: string;
  name: string;
  description?: string;
  icon?: ReactNode;
  installed?: boolean;
}

export interface AppMarketplaceGridProps {
  apps: MarketplaceApp[];
  onInstall?: (id: string) => void;
  onOpen?: (id: string) => void;
  columns?: number;
}

function columnsClass(columns: number) {
  switch (columns) {
    case 1:
      return styles.columns1;
    case 2:
      return styles.columns2;
    case 3:
      return styles.columns3;
    case 4:
      return styles.columns4;
    default:
      return styles.columns3;
  }
}

export function InternalAppMarketplaceGrid({
  apps,
  onInstall,
  onOpen,
  columns = 3,
}: AppMarketplaceGridProps) {
  if (apps.length === 0) {
    return <EmptyState title="No apps" description="No apps are available." />;
  }

  return (
    <div
      role="list"
      data-columns={String(columns)}
      data-mk-component="app-marketplace-grid"
      className={clsx(styles.root, columnsClass(columns))}
    >
      {apps.map((app) => {
        const showInstall = Boolean(onInstall) && !app.installed;
        const showOpen = Boolean(onOpen) && Boolean(app.installed);
        const showActions = showInstall || showOpen;

        return (
          <div key={app.id} role="listitem" className={styles.card}>
            <Container
              header={
                <Header
                  variant="h3"
                  description={app.description}
                  actions={app.installed ? <Badge color="success">Installed</Badge> : undefined}
                >
                  {app.name}
                </Header>
              }
              footer={
                showActions ? (
                  <SpaceBetween direction="horizontal" size="xs">
                    {showInstall && onInstall ? (
                      <Button
                        variant="primary"
                        aria-label={`Install ${app.name}`}
                        onClick={() => onInstall(app.id)}
                      >
                        Install
                      </Button>
                    ) : null}
                    {showOpen && onOpen ? (
                      <Button
                        variant="primary"
                        aria-label={`Open ${app.name}`}
                        onClick={() => onOpen(app.id)}
                      >
                        Open
                      </Button>
                    ) : null}
                  </SpaceBetween>
                ) : undefined
              }
            >
              {app.icon != null && app.icon !== false ? (
                <div className={styles.icon}>{app.icon}</div>
              ) : null}
            </Container>
          </div>
        );
      })}
    </div>
  );
}
