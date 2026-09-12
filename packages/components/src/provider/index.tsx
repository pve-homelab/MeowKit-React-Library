import { applyAccent, applyMode, type Accent, type Mode } from '@meowkit/global-styles';
import { useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { MeowKitContext, type MeowKitContextValue } from './context';

export interface MeowKitProviderProps {
  mode?: Mode;
  accent?: Accent;
  children: ReactNode;
}

export function MeowKitProvider({
  mode: modeProp = 'light',
  accent: accentProp = 'default',
  children,
}: MeowKitProviderProps) {
  const [mode, setModeState] = useState<Mode>(modeProp);
  const [accent, setAccentState] = useState<Accent>(accentProp);

  useEffect(() => {
    setModeState(modeProp);
  }, [modeProp]);

  useEffect(() => {
    setAccentState(accentProp);
  }, [accentProp]);

  useEffect(() => {
    applyMode(mode);
    applyAccent(accent);
  }, [mode, accent]);

  const value = useMemo<MeowKitContextValue>(
    () => ({
      mode,
      accent,
      setMode: setModeState,
      setAccent: setAccentState,
    }),
    [mode, accent],
  );

  return <MeowKitContext.Provider value={value}>{children}</MeowKitContext.Provider>;
}

export function useMeowKit(): MeowKitContextValue {
  const ctx = useContext(MeowKitContext);
  if (!ctx) {
    throw new Error('useMeowKit must be used within MeowKitProvider');
  }
  return ctx;
}
