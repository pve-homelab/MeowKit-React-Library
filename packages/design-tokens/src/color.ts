import type { Accent, Mode } from './types';

export type ColorTokens = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  accent: string;
  accentHover: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  focusRing: string;
  overlay: string;
};

const lightBase = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF1EA',
  text: '#000000',
  textMuted: 'rgb(0 0 0 / 0.55)',
  textInverse: '#FFFFFF',
  border: '#DFDFDF',
  borderStrong: '#000000',
  success: '#006400',
  warning: '#EE9441',
  error: '#B42318',
  info: '#0B6BCB',
  focusRing: '#BBE700',
  overlay: 'rgb(0 0 0 / 0.45)',
  accent: '#BBE700',
  accentHover: '#9DDE00',
} as const;

const darkBase = {
  background: '#121412',
  surface: '#1A1D1A',
  surfaceMuted: '#242824',
  text: '#F5F5F5',
  textMuted: 'rgb(245 245 245 / 0.65)',
  textInverse: '#000000',
  border: '#2E322E',
  borderStrong: '#F5F5F5',
  success: '#3ED660',
  warning: '#EE9441',
  error: '#FF6B5A',
  info: '#5EB1FF',
  focusRing: '#D7FF4A',
  overlay: 'rgb(0 0 0 / 0.6)',
  accent: '#BBE700',
  accentHover: '#D7FF4A',
} as const;

export function getColorTokens(mode: Mode, accent: Accent): ColorTokens {
  const base = mode === 'light' ? lightBase : darkBase;

  if (accent === 'lime') {
    return {
      ...base,
      primary: '#BBE700',
      primaryHover: mode === 'light' ? '#9DDE00' : '#D7FF4A',
      primaryText: '#000000',
    };
  }

  return {
    ...base,
    primary: mode === 'light' ? '#000000' : '#F5F5F5',
    primaryHover: mode === 'light' ? '#262626' : '#FFFFFF',
    primaryText: mode === 'light' ? '#FFFFFF' : '#000000',
  };
}
