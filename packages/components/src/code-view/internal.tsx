import clsx from 'clsx';
import styles from './styles.module.css';

export interface CodeViewProps {
  content: string;
  language?: string;
  lineNumbers?: boolean;
  className?: string;
}

export function InternalCodeView({ content, language, lineNumbers = false, className }: CodeViewProps) {
  const lines = content.split('\n');

  return (
    <div className={clsx(styles.root, className)} data-language={language}>
      {lineNumbers ? (
        <div className={styles.gutter} aria-hidden="true">
          {lines.map((_, index) => (
            <span key={index} className={styles.lineNumber} data-line-number={index + 1}>
              {index + 1}
            </span>
          ))}
        </div>
      ) : null}
      <pre className={styles.pre}>
        <code className={styles.code}>{content}</code>
      </pre>
    </div>
  );
}
