import type { CSSProperties } from 'react';

// ── Colors (from DesignSystem.tsx) ──
export const COLORS = {
  navy:     'var(--spacespot-navy-primary)',
  cyan:     'var(--spacespot-cyan-primary)',
  paleCyan: '#E0F9F7',
  white:    '#FFFFFF',
  gray:     'var(--spacespot-gray-500)',
  success:  '#10B981',
  // App layout
  pageBg:      '#eef2f6',
  cardBorder:  '#dbe5ee',
  subtitle:    '#6b7e91',
  body:        '#374151',
  muted:       '#5f7286',
};

// ── Typography (from DesignSystem.tsx) ──
export const TYPE: Record<string, CSSProperties> = {
  h1:          { fontSize: '48px', fontWeight: 700, lineHeight: 1.5 },
  h2:          { fontSize: '36px', fontWeight: 700, lineHeight: 1.5 },
  h3:          { fontSize: '24px', fontWeight: 700, lineHeight: 1.5 },
  body:        { fontSize: '16px', fontWeight: 400, lineHeight: 1.5 },
  small:       { fontSize: '14px', fontWeight: 400, lineHeight: 1.5 },
  meta:        { fontSize: '12px', fontWeight: 400, lineHeight: 1.5 },
  // App-specific
  pageTitle:    { fontSize: '22px', fontWeight: 700 },
  pageSubtitle: { fontSize: '13px', fontWeight: 400 },
  tableBody:    { fontSize: '13px', fontWeight: 400 },
  tableHeader:  { fontSize: '12px', fontWeight: 700, letterSpacing: '0.03em' },
  label:        { fontSize: '12px', fontWeight: 600 },
};

// ── Spacing (from DesignSystem.tsx) ──
export const SPACE = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
};

// ── Border Radius (from DesignSystem.tsx) ──
export const RADIUS = {
  none: '0px',
  xs:   '4px',
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  full: '9999px',
};

// ── Layout ──
export const LAYOUT: Record<string, CSSProperties> = {
  shell: {
    backgroundColor: '#eef2f6',
    minHeight: '100vh',
    padding: '24px 0 32px',
  },
  container: {
    maxWidth: '1342px',
    margin: '0 auto',
    padding: '0 24px',
  },
  sectionCard: {
    backgroundColor: '#fff',
    border: '1px solid #dbe5ee',
    borderRadius: RADIUS.sm,
    padding: '24px',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: `${SPACE.md}px`,
  },
};

// ── Input ──
export const INPUT: Record<string, CSSProperties> = {
  base: {
    width: '100%',
    border: '1px solid #cfd7e2',
    borderRadius: RADIUS.xs,
    padding: '9px 12px',
    fontSize: '13px',
    color: '#1f2937',
    backgroundColor: '#f9fbfc',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    appearance: 'none' as const,
    paddingRight: '30px',
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238fafc4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  },
  error: {
    color: '#e11d48',
    fontSize: '11px',
    marginTop: 2,
  },
};