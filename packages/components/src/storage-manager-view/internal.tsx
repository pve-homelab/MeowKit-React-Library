import Badge, { type BadgeColor } from '../badge';
import Button from '../button';
import Container from '../container';
import EmptyState from '../empty-state';
import Header from '../header';
import SpaceBetween from '../space-between';
import Table, { type TableColumnDefinition } from '../table';
import styles from './styles.module.css';

export type StorageEntryType = 'file' | 'folder';
export type StorageManagerStatus = 'idle' | 'busy' | 'success' | 'error';

export interface StorageManagerEntry {
  id: string;
  name: string;
  type: StorageEntryType;
  size?: number;
}

export interface StorageManagerViewProps {
  entries: StorageManagerEntry[];
  path: string;
  onNavigate: (id: string) => void;
  onUpload?: () => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
  status?: StorageManagerStatus;
}

function statusLabel(status: StorageManagerStatus): string {
  switch (status) {
    case 'idle':
      return 'Idle';
    case 'busy':
      return 'Busy';
    case 'success':
      return 'Success';
    case 'error':
      return 'Error';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function statusRole(status: StorageManagerStatus): 'status' | 'alert' {
  switch (status) {
    case 'idle':
    case 'busy':
    case 'success':
      return 'status';
    case 'error':
      return 'alert';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function statusColor(status: StorageManagerStatus): BadgeColor {
  switch (status) {
    case 'idle':
      return 'default';
    case 'busy':
      return 'info';
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function typeLabel(type: StorageEntryType): string {
  switch (type) {
    case 'file':
      return 'File';
    case 'folder':
      return 'Folder';
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

function formatSize(entry: StorageManagerEntry): string {
  if (entry.type !== 'file' || entry.size == null) {
    return '—';
  }
  return `${entry.size} B`;
}

export function InternalStorageManagerView({
  entries,
  path,
  onNavigate,
  onUpload,
  onDelete,
  onRefresh,
  status = 'idle',
}: StorageManagerViewProps) {
  const label = statusLabel(status);
  const busy = status === 'busy';

  const columns: TableColumnDefinition<StorageManagerEntry>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (entry) => (
        <Button variant="ghost" disabled={busy} onClick={() => onNavigate(entry.id)}>
          {entry.name}
        </Button>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      cell: (entry) => typeLabel(entry.type),
    },
    {
      id: 'size',
      header: 'Size',
      cell: (entry) => formatSize(entry),
    },
  ];

  if (onDelete) {
    columns.push({
      id: 'actions',
      header: 'Actions',
      cell: (entry) => (
        <Button
          variant="destructive"
          disabled={busy}
          onClick={() => onDelete(entry.id)}
          aria-label={`Delete ${entry.name}`}
        >
          Delete
        </Button>
      ),
    });
  }

  return (
    <Container
      header={
        <Header
          variant="h3"
          description={<span className={styles.path}>{path}</span>}
          actions={
            onUpload || onRefresh ? (
              <SpaceBetween direction="horizontal" size="xs">
                {onUpload ? (
                  <Button variant="secondary" disabled={busy} onClick={onUpload}>
                    Upload
                  </Button>
                ) : null}
                {onRefresh ? (
                  <Button variant="secondary" disabled={busy} onClick={onRefresh}>
                    Refresh
                  </Button>
                ) : null}
              </SpaceBetween>
            ) : undefined
          }
        >
          Storage
        </Header>
      }
    >
      <div
        role={statusRole(status)}
        data-status={status}
        data-mk-component="storage-manager-view"
        className={styles.status}
      >
        <Badge color={statusColor(status)}>{label}</Badge>
        {label}
      </div>
      <Table
        items={entries}
        columnDefinitions={columns}
        variant="embedded"
        empty={<EmptyState title="No files" description="This folder is empty." />}
      />
    </Container>
  );
}
