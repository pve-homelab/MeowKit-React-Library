import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import { isValidElement, type ReactNode } from 'react';
import styles from './styles.module.css';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: TooltipSide;
  className?: string;
}

function tooltipSide(side: TooltipSide): TooltipSide {
  switch (side) {
    case 'top':
    case 'right':
    case 'bottom':
    case 'left':
      return side;
    default: {
      const _exhaustive: never = side;
      return _exhaustive;
    }
  }
}

export function InternalTooltip({
  children,
  content,
  side = 'top',
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      {isValidElement(children) ? (
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      ) : (
        <TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>
      )}
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className={clsx(styles.content, className)}
          side={tooltipSide(side)}
          sideOffset={4}
          avoidCollisions={false}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
