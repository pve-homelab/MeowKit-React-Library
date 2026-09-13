import { useState } from 'react';
import Alert from '../alert';
import Badge, { type BadgeColor } from '../badge';
import Button from '../button';
import Checkbox from '../checkbox';
import Container from '../container';
import Header from '../header';
import Modal from '../modal';
import ProgressBar from '../progress-bar';
import SpaceBetween from '../space-between';
import styles from './styles.module.css';

export type FirmwareFlashingStatus = 'idle' | 'busy' | 'success' | 'error';

export interface FirmwareFlashingPanelProps {
  deviceName?: string;
  progress?: number;
  status: FirmwareFlashingStatus;
  errorMessage?: string;
  onConnect: () => void;
  onFlash: () => void;
  onCancel?: () => void;
  confirmErase?: boolean;
  onConfirmEraseChange?: (confirmed: boolean) => void;
}

function statusLabel(status: FirmwareFlashingStatus): string {
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

function statusRole(status: FirmwareFlashingStatus): 'status' | 'alert' {
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

function statusColor(status: FirmwareFlashingStatus): BadgeColor {
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

export function InternalFirmwareFlashingPanel({
  deviceName,
  progress = 0,
  status,
  errorMessage,
  onConnect,
  onFlash,
  onCancel,
  confirmErase = false,
  onConfirmEraseChange,
}: FirmwareFlashingPanelProps) {
  const [eraseOpen, setEraseOpen] = useState(false);
  const label = statusLabel(status);
  const busy = status === 'busy';
  const deviceLabel = deviceName ?? 'No device';

  function handleFlash() {
    if (busy) {
      return;
    }
    if (confirmErase) {
      onFlash();
      return;
    }
    setEraseOpen(true);
  }

  function handleConfirmErase() {
    onConfirmEraseChange?.(true);
    setEraseOpen(false);
    onFlash();
  }

  function handleDismissErase() {
    setEraseOpen(false);
  }

  return (
    <Container
      header={
        <Header
          variant="h3"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="secondary" disabled={busy} onClick={onConnect}>
                Connect
              </Button>
              <Button variant="primary" disabled={busy} onClick={handleFlash}>
                Flash
              </Button>
              {onCancel ? (
                <Button variant="destructive" disabled={!busy} onClick={onCancel}>
                  Cancel
                </Button>
              ) : null}
            </SpaceBetween>
          }
        >
          Firmware
        </Header>
      }
    >
      <div
        role={statusRole(status)}
        data-status={status}
        data-mk-component="firmware-flashing-panel"
        className={styles.status}
      >
        <Badge color={statusColor(status)}>{label}</Badge>
        {label}
      </div>
      {errorMessage ? (
        <Alert type="error" className={styles.error}>
          {errorMessage}
        </Alert>
      ) : null}
      <div className={styles.device}>{deviceLabel}</div>
      <ProgressBar className={styles.progress} value={progress} label="Flash progress" />
      {onConfirmEraseChange ? (
        <Checkbox checked={confirmErase} disabled={busy} onChange={onConfirmEraseChange}>
          Confirm erase
        </Checkbox>
      ) : null}
      <Modal
        visible={eraseOpen}
        onDismiss={handleDismissErase}
        header="Confirm erase"
        footer={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="secondary" onClick={handleDismissErase}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmErase}>
              Erase and flash
            </Button>
          </SpaceBetween>
        }
      >
        This will erase the device before flashing new firmware.
      </Modal>
    </Container>
  );
}
