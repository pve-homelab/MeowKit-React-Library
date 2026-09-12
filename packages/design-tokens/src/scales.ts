export const space = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
} as const;

export const radius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

export const font = {
  familySans: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  familyMono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  sizeXs: '12px',
  sizeSm: '14px',
  sizeMd: '16px',
  sizeLg: '18px',
  sizeXl: '24px',
  weightRegular: '400',
  weightMedium: '500',
  weightBold: '700',
  lineHeightTight: '1.2',
  lineHeightNormal: '1.5',
} as const;

export const motion = {
  fast: '62ms',
  medium: '125ms',
  slow: '200ms',
  easingDefault: 'cubic-bezier(0, 0, 0.2, 1)',
  easingHover: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

export const shadow = {
  sm: '0 1px 2px rgb(0 0 0 / 0.08)',
  md: '0 4px 12px rgb(0 0 0 / 0.12)',
  lg: '0 12px 32px rgb(0 0 0 / 0.16)',
} as const;

export const zIndex = {
  dropdown: '1000',
  sticky: '1100',
  modal: '1300',
  toast: '1400',
} as const;
