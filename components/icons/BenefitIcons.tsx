const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export function ShieldIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} {...props} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9,12 11,14 15,10" />
    </svg>
  )
}

export function PrintIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} {...props} aria-hidden="true">
      <polyline points="6,9 6,2 18,2 18,9" />
      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
      <line x1="9" y1="17" x2="15" y2="17" />
      <line x1="9" y1="20" x2="12" y2="20" />
    </svg>
  )
}

export function LayersIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} {...props} aria-hidden="true">
      <polygon points="12,2 2,7 12,12 22,7" />
      <polyline points="2,17 12,22 22,17" />
      <polyline points="2,12 12,17 22,12" />
    </svg>
  )
}

export function PaletteIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} {...props} aria-hidden="true">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      <circle cx="7" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="11" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function RulerIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} {...props} aria-hidden="true">
      <path d="M21.3 8.7L8.7 21.3c-.4.4-1 .4-1.4 0l-6.6-6.6a1 1 0 010-1.4L13.3 2.7c.4-.4 1-.4 1.4 0l6.6 6.6c.4.4.4 1 0 1.4z" />
      <path d="M7.5 10.5l2 2M10.5 7.5l2 2M13.5 4.5l2 2" />
    </svg>
  )
}

export function ZapIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} {...props} aria-hidden="true">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
    </svg>
  )
}
