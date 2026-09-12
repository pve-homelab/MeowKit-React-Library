import clsx from 'clsx';
import { createElement, type JSX, type ReactNode } from 'react';
import styles from './styles.module.css';

export type BoxSpacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'none';
export type BoxColor = 'text' | 'muted' | 'inverse';
export type BoxFontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BoxFontWeight = 'regular' | 'medium' | 'bold';

export interface BoxProps {
  children?: ReactNode;
  padding?: BoxSpacing;
  margin?: BoxSpacing;
  color?: BoxColor;
  fontSize?: BoxFontSize;
  fontWeight?: BoxFontWeight;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

function paddingClass(padding: BoxSpacing) {
  switch (padding) {
    case 'none':
      return styles.paddingNone;
    case 0:
      return styles.padding0;
    case 1:
      return styles.padding1;
    case 2:
      return styles.padding2;
    case 3:
      return styles.padding3;
    case 4:
      return styles.padding4;
    case 5:
      return styles.padding5;
    case 6:
      return styles.padding6;
    case 7:
      return styles.padding7;
    default: {
      const _exhaustive: never = padding;
      return _exhaustive;
    }
  }
}

function marginClass(margin: BoxSpacing) {
  switch (margin) {
    case 'none':
      return styles.marginNone;
    case 0:
      return styles.margin0;
    case 1:
      return styles.margin1;
    case 2:
      return styles.margin2;
    case 3:
      return styles.margin3;
    case 4:
      return styles.margin4;
    case 5:
      return styles.margin5;
    case 6:
      return styles.margin6;
    case 7:
      return styles.margin7;
    default: {
      const _exhaustive: never = margin;
      return _exhaustive;
    }
  }
}

function colorClass(color: BoxColor) {
  switch (color) {
    case 'text':
      return styles.colorText;
    case 'muted':
      return styles.colorMuted;
    case 'inverse':
      return styles.colorInverse;
    default: {
      const _exhaustive: never = color;
      return _exhaustive;
    }
  }
}

function fontSizeClass(fontSize: BoxFontSize) {
  switch (fontSize) {
    case 'xs':
      return styles.fontSizeXs;
    case 'sm':
      return styles.fontSizeSm;
    case 'md':
      return styles.fontSizeMd;
    case 'lg':
      return styles.fontSizeLg;
    case 'xl':
      return styles.fontSizeXl;
    default: {
      const _exhaustive: never = fontSize;
      return _exhaustive;
    }
  }
}

function fontWeightClass(fontWeight: BoxFontWeight) {
  switch (fontWeight) {
    case 'regular':
      return styles.fontWeightRegular;
    case 'medium':
      return styles.fontWeightMedium;
    case 'bold':
      return styles.fontWeightBold;
    default: {
      const _exhaustive: never = fontWeight;
      return _exhaustive;
    }
  }
}

export function InternalBox({
  children,
  padding,
  margin,
  color,
  fontSize,
  fontWeight,
  className,
  as = 'div',
}: BoxProps) {
  return createElement(
    as,
    {
      className: clsx(
        styles.root,
        padding !== undefined ? paddingClass(padding) : undefined,
        margin !== undefined ? marginClass(margin) : undefined,
        color !== undefined ? colorClass(color) : undefined,
        fontSize !== undefined ? fontSizeClass(fontSize) : undefined,
        fontWeight !== undefined ? fontWeightClass(fontWeight) : undefined,
        className,
      ),
    },
    children,
  );
}
