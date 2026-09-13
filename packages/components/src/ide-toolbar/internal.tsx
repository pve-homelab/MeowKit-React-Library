import type { ReactNode } from 'react';
import Button from '../button';
import Toolbar from '../toolbar';
import styles from './styles.module.css';

export interface IDEToolbarProps {
  onSave?: () => void;
  onBuild?: () => void;
  onFlash?: () => void;
  onRun?: () => void;
  busy?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}

export function InternalIDEToolbar({
  onSave,
  onBuild,
  onFlash,
  onRun,
  busy = false,
  left,
  right,
  children,
}: IDEToolbarProps) {
  return (
    <Toolbar left={left} right={right}>
      <div className={styles.actions} data-mk-component="ide-toolbar">
        {onSave != null ? (
          <Button variant="secondary" disabled={busy} onClick={onSave}>
            Save
          </Button>
        ) : null}
        {onBuild != null ? (
          <Button variant="secondary" disabled={busy} onClick={onBuild}>
            Build
          </Button>
        ) : null}
        {onFlash != null ? (
          <Button variant="secondary" disabled={busy} onClick={onFlash}>
            Flash
          </Button>
        ) : null}
        {onRun != null ? (
          <Button variant="primary" disabled={busy} onClick={onRun}>
            Run
          </Button>
        ) : null}
      </div>
      {children != null && children !== false ? <div className={styles.extra}>{children}</div> : null}
    </Toolbar>
  );
}
