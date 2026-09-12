import { createContext } from 'react';
import type { Accent, Mode } from '@meowkit/global-styles';

export type MeowKitContextValue = {
  mode: Mode;
  accent: Accent;
  setMode: (mode: Mode) => void;
  setAccent: (accent: Accent) => void;
};

export const MeowKitContext = createContext<MeowKitContextValue | null>(null);
