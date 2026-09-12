import type { ReactNode, SVGProps } from 'react';

export const ICON_NAMES = [
  'add',
  'close',
  'check',
  'chevron-down',
  'chevron-right',
  'search',
  'settings',
  'folder',
  'file',
  'usb',
  'battery',
  'apps',
  'warning',
  'error',
  'info',
  'success',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export type IconGlyphProps = SVGProps<SVGSVGElement>;

function Glyph({ children, ...rest }: IconGlyphProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function AddGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 5v14M5 12h14" />
    </Glyph>
  );
}

export function CloseGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Glyph>
  );
}

export function CheckGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M5 12l5 5L19 7" />
    </Glyph>
  );
}

export function ChevronDownGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M6 9l6 6 6-6" />
    </Glyph>
  );
}

export function ChevronRightGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M9 6l6 6-6 6" />
    </Glyph>
  );
}

export function SearchGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l5 5" />
    </Glyph>
  );
}

export function SettingsGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </Glyph>
  );
}

export function FolderGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3 7h6l2 2h10v10H3z" />
    </Glyph>
  );
}

export function FileGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
    </Glyph>
  );
}

export function UsbGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M8 11h8v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" />
      <path d="M10 11V5h4v6" />
      <path d="M10 5V3M14 5V2" />
    </Glyph>
  );
}

export function BatteryGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="7" width="16" height="10" rx="2" />
      <path d="M19 10h2v4h-2" />
      <path d="M7 10v4M11 10v4" />
    </Glyph>
  );
}

export function AppsGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </Glyph>
  );
}

export function WarningGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 4l9 16H3L12 4z" />
      <path d="M12 10v4M12 17h.01" />
    </Glyph>
  );
}

export function ErrorGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </Glyph>
  );
}

export function InfoGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 8h.01" />
    </Glyph>
  );
}

export function SuccessGlyph(props: IconGlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </Glyph>
  );
}

export const iconMap = {
  add: AddGlyph,
  close: CloseGlyph,
  check: CheckGlyph,
  'chevron-down': ChevronDownGlyph,
  'chevron-right': ChevronRightGlyph,
  search: SearchGlyph,
  settings: SettingsGlyph,
  folder: FolderGlyph,
  file: FileGlyph,
  usb: UsbGlyph,
  battery: BatteryGlyph,
  apps: AppsGlyph,
  warning: WarningGlyph,
  error: ErrorGlyph,
  info: InfoGlyph,
  success: SuccessGlyph,
} as const satisfies Record<IconName, (props: IconGlyphProps) => ReactNode>;
