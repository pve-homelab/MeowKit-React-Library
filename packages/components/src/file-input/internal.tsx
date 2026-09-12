import { forwardRef, useRef, useState, type ChangeEvent } from 'react';
import Button from '../button';
import styles from './styles.module.css';

export interface FileInputProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange?: (files: FileList | null) => void;
  buttonText?: string;
}

function fileNamesFromList(files: FileList | null): string {
  if (!files || files.length === 0) {
    return '';
  }
  return Array.from(files)
    .map((file) => file.name)
    .join(', ');
}

export const InternalFileInput = forwardRef<HTMLInputElement, FileInputProps>(
  function InternalFileInput(
    { accept, multiple, disabled, onChange, buttonText = 'Choose file' },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileNames, setFileNames] = useState('');

    function assignRef(node: HTMLInputElement | null) {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      const files = event.target.files;
      setFileNames(fileNamesFromList(files));
      onChange?.(files);
    }

    function handleButtonClick() {
      inputRef.current?.click();
    }

    return (
      <div className={styles.root}>
        <input
          ref={assignRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className={styles.input}
          tabIndex={-1}
        />
        <Button variant="secondary" disabled={disabled} onClick={handleButtonClick}>
          {buttonText}
        </Button>
        {fileNames ? <span className={styles.names}>{fileNames}</span> : null}
      </div>
    );
  },
);
