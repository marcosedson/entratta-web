'use client'

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: '0.58rem',
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: '#22C55E',
        marginBottom: '11px',
      }}
    >
      {children}
    </div>
  )
}
