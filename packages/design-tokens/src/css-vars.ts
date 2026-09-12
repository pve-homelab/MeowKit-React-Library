import { getColorTokens } from './color';
import { font, motion, radius, shadow, space, zIndex } from './scales';
import type { Accent, Mode } from './types';

export function getCssVars(mode: Mode, accent: Accent): Record<string, string> {
  const color = getColorTokens(mode, accent);
  const vars: Record<string, string> = {
    '--mk-color-background': color.background,
    '--mk-color-surface': color.surface,
    '--mk-color-surface-muted': color.surfaceMuted,
    '--mk-color-text': color.text,
    '--mk-color-text-muted': color.textMuted,
    '--mk-color-text-inverse': color.textInverse,
    '--mk-color-border': color.border,
    '--mk-color-border-strong': color.borderStrong,
    '--mk-color-primary': color.primary,
    '--mk-color-primary-hover': color.primaryHover,
    '--mk-color-primary-text': color.primaryText,
    '--mk-color-accent': color.accent,
    '--mk-color-accent-hover': color.accentHover,
    '--mk-color-success': color.success,
    '--mk-color-warning': color.warning,
    '--mk-color-error': color.error,
    '--mk-color-info': color.info,
    '--mk-color-focus-ring': color.focusRing,
    '--mk-color-overlay': color.overlay,
    '--mk-font-family-sans': font.familySans,
    '--mk-font-family-mono': font.familyMono,
    '--mk-font-size-xs': font.sizeXs,
    '--mk-font-size-sm': font.sizeSm,
    '--mk-font-size-md': font.sizeMd,
    '--mk-font-size-lg': font.sizeLg,
    '--mk-font-size-xl': font.sizeXl,
    '--mk-font-weight-regular': font.weightRegular,
    '--mk-font-weight-medium': font.weightMedium,
    '--mk-font-weight-bold': font.weightBold,
    '--mk-line-height-tight': font.lineHeightTight,
    '--mk-line-height-normal': font.lineHeightNormal,
    '--mk-motion-fast': motion.fast,
    '--mk-motion-medium': motion.medium,
    '--mk-motion-slow': motion.slow,
    '--mk-motion-easing-default': motion.easingDefault,
    '--mk-motion-easing-hover': motion.easingHover,
    '--mk-shadow-sm': shadow.sm,
    '--mk-shadow-md': shadow.md,
    '--mk-shadow-lg': shadow.lg,
    '--mk-z-dropdown': zIndex.dropdown,
    '--mk-z-sticky': zIndex.sticky,
    '--mk-z-modal': zIndex.modal,
    '--mk-z-toast': zIndex.toast,
  };

  for (const [key, value] of Object.entries(space)) {
    vars[`--mk-space-${key}`] = value;
  }
  for (const [key, value] of Object.entries(radius)) {
    vars[`--mk-radius-${key}`] = value;
  }

  return vars;
}
