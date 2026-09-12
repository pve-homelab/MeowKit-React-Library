import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { FlashbarItem } from './internal';

export type FlashbarContextValue = {
  items: FlashbarItem[];
  add: (item: FlashbarItem) => void;
  dismiss: (id: string) => void;
  clear: () => void;
};

export const FlashbarContext = createContext<FlashbarContextValue | null>(null);

export function FlashbarProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FlashbarItem[]>([]);

  const add = useCallback((item: FlashbarItem) => {
    setItems((current) => {
      const without = current.filter((entry) => entry.id !== item.id);
      return [...without, item];
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<FlashbarContextValue>(
    () => ({ items, add, dismiss, clear }),
    [items, add, dismiss, clear],
  );

  return <FlashbarContext.Provider value={value}>{children}</FlashbarContext.Provider>;
}

export function useFlashbar(): FlashbarContextValue {
  const ctx = useContext(FlashbarContext);
  if (!ctx) {
    throw new Error('useFlashbar must be used within MeowKitProvider');
  }
  return ctx;
}
