import Badge, { type BadgeColor } from '../badge';
import Button from '../button';
import CodeView from '../code-view';
import Container from '../container';
import Header from '../header';
import styles from './styles.module.css';

export type BuildOutputStatus = 'idle' | 'busy' | 'success' | 'error';

export interface BuildOutputPanelProps {
  lines: string[];
  status?: BuildOutputStatus;
  onClear?: () => void;
}

function statusLabel(status: BuildOutputStatus): string {
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

function statusRole(status: BuildOutputStatus): 'status' | 'alert' {
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

function statusColor(status: BuildOutputStatus): BadgeColor {
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

export function InternalBuildOutputPanel({
  lines,
  status = 'idle',
  onClear,
}: BuildOutputPanelProps) {
  const label = statusLabel(status);

  return (
    <Container
      header={
        <Header
          variant="h3"
          actions={
            onClear ? (
              <Button variant="secondary" onClick={onClear}>
                Clear
              </Button>
            ) : undefined
          }
        >
          Build output
        </Header>
      }
    >
      <div
        role={statusRole(status)}
        data-status={status}
        data-mk-component="build-output-panel"
        className={styles.status}
      >
        <Badge color={statusColor(status)}>{label}</Badge>
        {label}
      </div>
      <CodeView className={styles.log} content={lines.join('\n')} language="log" />
    </Container>
  );
}
