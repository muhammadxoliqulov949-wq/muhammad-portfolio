import type { SVGProps } from "react";

/**
 * Yagona ikonka tizimi (audit P1-7: sayt bo'ylab 22 ta emoji ikonka aralashib
 * ketgan edi). 24px setka, 1.5px stroke, currentColor — ikkala temada ham
 * to'g'ri ko'rinadi, SVG bo'lgani uchun rangi token bilan boshqariladi va
 * skrinridderlar uchun `aria-hidden` bilan beriladi (matn yonida).
 *
 * Ishlatish: <Icon name="arrow-up-right" size={16} />
 */

export type IconName =
  // UI
  | "arrow-up-right"
  | "arrow-right"
  | "arrow-up"
  | "chevron-down"
  | "chevron-up"
  | "check"
  | "close"
  | "menu"
  | "copy"
  | "external"
  | "search"
  | "trash"
  | "pencil"
  | "plus"
  | "save"
  | "undo"
  | "alert"
  | "info"
  | "eye"
  | "sun"
  | "moon"
  | "grip"
  // Kontakat / brend
  | "mail"
  | "telegram"
  | "github"
  | "linkedin"
  | "instagram"
  | "pin"
  | "download"
  | "clock"
  | "star"
  | "quote"
  | "sparkle"
  // Xizmatlar uchun
  | "rocket"
  | "layers"
  | "gauge"
  | "bot"
  | "code"
  | "database"
  | "shield"
  | "target"
  | "zap"
  | "pen";

const P: Record<IconName, React.ReactNode> = {
  "arrow-up-right": <path d="M7 17 17 7M9 7h8v8" />,
  "arrow-right": <path d="M4 12h15m-6-6 6 6-6 6" />,
  "arrow-up": <path d="M12 19V5m-6 6 6-6 6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-up": <path d="m6 15 6-6 6 6" />,
  check: <path d="M20 6 9 17l-5-5" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
      <path d="M10 11v7M14 11v7" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20h4L20 8l-4-4L4 16v4Z" />
      <path d="m14 6 4 4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  save: (
    <>
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M8 4v5h7V4" />
      <rect x="8" y="13" width="8" height="7" />
    </>
  ),
  undo: (
    <>
      <path d="M4 10h9a5 5 0 0 1 0 10H8" />
      <path d="m8 6-4 4 4 4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.5 20h19z" />
      <path d="M12 10v4M12 17.5v.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8.2v.3" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  grip: (
    <>
      <circle cx="9" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  telegram: <path d="M21 5 3 12l5 1.8L19 7l-8.6 9.2L10.5 21l2-4.6 3 2.6z" />,
  github: (
    <path
      d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
      fill="currentColor"
      stroke="none"
    />
  ),
  linkedin: (
    <path
      d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"
      fill="currentColor"
      stroke="none"
    />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </>
  ),
  star: (
    <path
      d="M12 2.5l2.9 6.26 6.6.8-4.9 4.68 1.3 6.76L12 17.8l-5.9 3.2 1.3-6.76L2.5 9.56l6.6-.8z"
      fill="currentColor"
      stroke="none"
    />
  ),
  quote: <path d="M9 6c-3 2-4.5 4.5-4.5 8 0 2.5 1.5 4 3.5 4S11 16.5 11 14.5 9.8 11 8 11c1-2 2-3 3-3.6zm9 0c-3 2-4.5 4.5-4.5 8 0 2.5 1.5 4 3.5 4s3-1.5 3-3.5-1.2-3.5-3-3.5c1-2 2-3 3-3.6z" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  rocket: (
    <>
      <path d="M14 4c3 1 5 3 6 6l-8 8-4-4z" />
      <path d="M8 14l-3 1 4 4 1-3" />
      <path d="M6 18c-1.5 1-2 4-2 4s3-.5 4-2" />
      <circle cx="15" cy="9" r="1.6" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8 4.5-8 4.5-8-4.5z" />
      <path d="m4 12 8 4.5L20 12" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="M12 18v-2" />
      <path d="m15 11-3 3" />
    </>
  ),
  bot: (
    <>
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 4v4M9 2.5h6" />
      <circle cx="9.2" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  code: <path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 5l-4 14" />,
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
      <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </>
  ),
  shield: <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2" />
    </>
  ),
  zap: <path d="M13 3 5 14h5l-1 7 8-11h-5z" />,
  pen: (
    <>
      <path d="M3 21c3-.5 4.5-2 6-4l8-9-3-3-9 8c-2 1.5-3.5 3-4 6z" />
      <path d="m14 5 3 3" />
    </>
  ),
};

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
};

export default function Icon({ name, size = 20, strokeWidth = 1.6, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {P[name]}
    </svg>
  );
}
