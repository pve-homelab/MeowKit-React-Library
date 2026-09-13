import { useId, useState, type FormEvent } from 'react';
import Badge, { type BadgeColor } from '../badge';
import Button from '../button';
import Container from '../container';
import FormField from '../form-field';
import Header from '../header';
import Input from '../input';
import styles from './styles.module.css';

export type SerialConsoleStream = 'stdout' | 'stderr' | 'system';

export interface SerialConsoleLine {
  id: string;
  text: string;
  stream?: SerialConsoleStream;
}

export interface SerialConsoleViewProps {
  lines: SerialConsoleLine[];
  onSend: (line: string) => void;
  onClear?: () => void;
  connected?: boolean;
  disabled?: boolean;
}

function streamClass(stream: SerialConsoleStream) {
  switch (stream) {
    case 'stdout':
      return styles.stdout;
    case 'stderr':
      return styles.stderr;
    case 'system':
      return styles.system;
    default: {
      const _exhaustive: never = stream;
      return _exhaustive;
    }
  }
}

function connectedColor(connected: boolean): BadgeColor {
  return connected ? 'success' : 'warning';
}

export function InternalSerialConsoleView({
  lines,
  onSend,
  onClear,
  connected = true,
  disabled = false,
}: SerialConsoleViewProps) {
  const inputId = useId();
  const [draft, setDraft] = useState('');
  const sendDisabled = disabled || !connected;
  const connectedLabel = connected ? 'Connected' : 'Disconnected';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const line = draft.trim();
    if (!line || sendDisabled) {
      return;
    }
    onSend(line);
    setDraft('');
  }

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
          Serial console
        </Header>
      }
    >
      <div
        role="status"
        data-connected={connected ? 'true' : 'false'}
        data-mk-component="serial-console-view"
        className={styles.status}
      >
        <Badge color={connectedColor(connected)}>{connectedLabel}</Badge>
        {connectedLabel}
      </div>
      <div className={styles.log} aria-label="Serial output">
        {lines.map((line) => {
          const stream = line.stream ?? 'stdout';
          return (
            <div key={line.id} className={streamClass(stream)} data-stream={stream}>
              {line.text}
            </div>
          );
        })}
      </div>
      <form className={styles.send} onSubmit={handleSubmit}>
        <FormField label="Send" htmlFor={inputId} className={styles.field}>
          <Input
            id={inputId}
            value={draft}
            disabled={sendDisabled}
            autoComplete="off"
            onChange={(event) => setDraft(event.target.value)}
          />
        </FormField>
        <Button type="submit" variant="primary" disabled={sendDisabled}>
          Send
        </Button>
      </form>
    </Container>
  );
}
