import Alert from '../alert';
import Badge, { type BadgeColor } from '../badge';
import Button from '../button';
import Container from '../container';
import EmptyState from '../empty-state';
import Header from '../header';
import SpaceBetween from '../space-between';
import Table, { type TableColumnDefinition } from '../table';
import styles from './styles.module.css';

export type DeviceConnectionStatus = 'connected' | 'disconnected' | 'busy';
export type DeviceManagerStatus = 'idle' | 'busy' | 'success' | 'error';

export interface DeviceManagerDevice {
  id: string;
  name: string;
  status: DeviceConnectionStatus;
}

export interface DeviceManagerPanelProps {
  devices: DeviceManagerDevice[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  onRefresh?: () => void;
  status?: DeviceManagerStatus;
  errorMessage?: string;
}

function panelStatusLabel(status: DeviceManagerStatus): string {
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

function panelStatusRole(status: DeviceManagerStatus): 'status' | 'alert' {
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

function panelStatusColor(status: DeviceManagerStatus): BadgeColor {
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

function deviceStatusLabel(status: DeviceConnectionStatus): string {
  switch (status) {
    case 'connected':
      return 'Connected';
    case 'disconnected':
      return 'Disconnected';
    case 'busy':
      return 'Busy';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function deviceStatusColor(status: DeviceConnectionStatus): BadgeColor {
  switch (status) {
    case 'connected':
      return 'success';
    case 'disconnected':
      return 'default';
    case 'busy':
      return 'info';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function InternalDeviceManagerPanel({
  devices,
  selectedId,
  onSelect,
  onConnect,
  onDisconnect,
  onRefresh,
  status = 'idle',
  errorMessage,
}: DeviceManagerPanelProps) {
  const label = panelStatusLabel(status);
  const busy = status === 'busy';
  const selected = devices.find((device) => device.id === selectedId);
  const connectDisabled = busy || !selected || selected.status !== 'disconnected';
  const disconnectDisabled = busy || !selected || selected.status !== 'connected';

  const columns: TableColumnDefinition<DeviceManagerDevice>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (device) => {
        const isSelected = device.id === selectedId;
        return (
          <Button
            variant="ghost"
            disabled={busy}
            data-selected={isSelected ? 'true' : 'false'}
            className={isSelected ? styles.selected : undefined}
            onClick={() => onSelect?.(device.id)}
          >
            {device.name}
          </Button>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: (device) => (
        <Badge color={deviceStatusColor(device.status)}>{deviceStatusLabel(device.status)}</Badge>
      ),
    },
  ];

  return (
    <Container
      header={
        <Header
          variant="h3"
          actions={
            onConnect || onDisconnect || onRefresh ? (
              <SpaceBetween direction="horizontal" size="xs">
                {onConnect ? (
                  <Button
                    variant="primary"
                    disabled={connectDisabled}
                    onClick={() => {
                      if (selected) {
                        onConnect(selected.id);
                      }
                    }}
                  >
                    Connect
                  </Button>
                ) : null}
                {onDisconnect ? (
                  <Button
                    variant="secondary"
                    disabled={disconnectDisabled}
                    onClick={() => {
                      if (selected) {
                        onDisconnect(selected.id);
                      }
                    }}
                  >
                    Disconnect
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
          Devices
        </Header>
      }
    >
      <div
        role={panelStatusRole(status)}
        data-status={status}
        data-mk-component="device-manager-panel"
        className={styles.status}
      >
        <Badge color={panelStatusColor(status)}>{label}</Badge>
        {label}
      </div>
      {errorMessage ? (
        <Alert type="error" className={styles.error}>
          {errorMessage}
        </Alert>
      ) : null}
      <Table
        items={devices}
        columnDefinitions={columns}
        variant="embedded"
        empty={<EmptyState title="No devices" description="No devices are available." />}
      />
    </Container>
  );
}
