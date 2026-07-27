import type { SVGProps } from "react";

export type IconName =
  | "brand" | "home" | "flow" | "zap" | "admin" | "search" | "bell" | "help"
  | "chev" | "x" | "plus" | "ext" | "grid" | "rows" | "gear" | "users"
  | "cloud" | "robot" | "check" | "star" | "edit" | "pause" | "db" | "play" | "more" | "sparkles" | "copy";

const TAM = { sm: "h-[15px] w-[15px]", md: "h-5 w-5", lg: "h-[30px] w-[30px]" } as const;

export function Icon({ name, size = "md", className = "", ...rest }: { name: IconName; size?: keyof typeof TAM; className?: string } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${TAM[size]} shrink-0 ${className}`} {...rest}>
      <use href={`#i-${name}`} />
    </svg>
  );
}

// Montar UNA vez en la raíz del shell (ver layout-principal.tsx).
export function IconSprite() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <symbol id="i-brand" viewBox="0 0 24 24"><g fill="currentColor" stroke="none"><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/></g><g stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"><path d="M8.3 7.1 15.7 11M8.3 16.9 15.7 13"/></g></symbol>
      <symbol id="i-home" viewBox="0 0 24 24"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></symbol>
      <symbol id="i-flow" viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8 15.8 6.4M8.2 13.2 15.8 17.6"/></symbol>
      <symbol id="i-zap" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></symbol>
      <symbol id="i-admin" viewBox="0 0 24 24"><path d="M21 4H14M10 4H3M21 12H12M8 12H3M21 20H16M12 20H3"/><path d="M14 2v4M8 10v4M16 18v4"/></symbol>
      <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></symbol>
      <symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></symbol>
      <symbol id="i-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.2 9a3 3 0 0 1 5.7 1c0 2-2.9 3-2.9 3"/><path d="M12 17h.01"/></symbol>
      <symbol id="i-chev" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></symbol>
      <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
      <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
      <symbol id="i-ext" viewBox="0 0 24 24"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></symbol>
      <symbol id="i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></symbol>
      <symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/></symbol>
      <symbol id="i-cloud" viewBox="0 0 24 24"><path d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6-1.5A4 4 0 0 0 6.5 19z"/></symbol>
      <symbol id="i-robot" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="11" rx="2"/><path d="M12 8V5M9 13h.01M15 13h.01"/></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"/></symbol>
      <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 2 3 6.5 7 .8-5 4.8 1.3 7L12 17.8 5.4 21l1.3-7-5-4.8 7-.8z"/></symbol>
      <symbol id="i-edit" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></symbol>
      <symbol id="i-pause" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></symbol>
      <symbol id="i-db" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></symbol>
      <symbol id="i-play" viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></symbol>
      <symbol id="i-more" viewBox="0 0 24 24"><g fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></g></symbol>
      <symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></symbol>
      <symbol id="i-rows" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M3 14.5h18M9 4v16"/></symbol>
      <symbol id="i-sparkles" viewBox="0 0 24 24"><path d="m12 3 1.9 4.8L18 9.7l-4.1 1.9L12 16.5l-1.9-4.9L6 9.7l4.1-1.9zM19 16l.9 2.1L22 19l-2.1.9-.9 2.1-.9-2.1L16 19l2.1-.9zM5 3l.9 2.1L8 6l-2.1.9L5 9l-.9-2.1L2 6l2.1-.9z"/></symbol>
      <symbol id="i-copy" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></symbol>
    </svg>
  );
}
