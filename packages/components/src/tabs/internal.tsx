import * as TabsPrimitive from '@radix-ui/react-tabs';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface TabsItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabsItem[];
  activeTabId?: string;
  defaultActiveTabId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function InternalTabs({
  tabs,
  activeTabId,
  defaultActiveTabId,
  onChange,
  className,
}: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={clsx(styles.root, className)}
      value={activeTabId}
      defaultValue={defaultActiveTabId}
      onValueChange={onChange}
    >
      <TabsPrimitive.List className={styles.list}>
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
            className={styles.trigger}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.id} value={tab.id} className={styles.panel}>
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
