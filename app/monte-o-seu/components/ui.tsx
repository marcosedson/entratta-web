'use client'

export const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.08)', borderRadius: 8,
  padding: '9px 11px', color: '#E2E8F0', fontSize: '.82rem',
  fontFamily: "'Inter', sans-serif", outline: 'none',
}
export const secStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
  borderRadius: 11, padding: '13px 14px', marginBottom: 10,
}
export const secTitleStyle: React.CSSProperties = {
  fontSize: '.58rem', fontWeight: 700, letterSpacing: 1.5,
  textTransform: 'uppercase', color: '#22C55E', marginBottom: 11,
  display: 'flex', alignItems: 'center', gap: 5,
}
export const chipBtnBase: React.CSSProperties = {
  padding: '5px 10px', borderRadius: 6, cursor: 'pointer', outline: 'none',
  fontSize: '.7rem', fontWeight: 600, transition: 'all .15s',
}
export const rotBtnStyle: React.CSSProperties = {
  flex: 1, padding: '7px 0', borderRadius: 7, cursor: 'pointer',
  border: '1.5px solid rgba(255,255,255,.07)', background: 'rgba(255,255,255,.02)',
  color: '#94A3B8', fontSize: '.8rem', fontWeight: 700,
}

export function adjustHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount))
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount))
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

export function Section({ title, locked, children }: { title: string; locked?: boolean; children: React.ReactNode }) {
  return (
    <div style={secStyle}>
      <div style={secTitleStyle}>
        {title}
        {locked && <span style={{ fontSize: '.6rem', background: 'rgba(34,197,94,.15)', color: '#22C55E', padding: '1px 6px', borderRadius: 4, letterSpacing: 0 }}>🔒 travado</span>}
      </div>
      {children}
    </div>
  )
}

export function CoresRow({ cores, ativo, onSelect, locked }: {
  cores: Array<{ id: string; label: string; hex: string }>
  ativo: string
  onSelect: (id: string) => void
  locked?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, alignItems: 'center', pointerEvents: locked ? 'none' : undefined }}>
      {cores.map(c => (
        <div key={c.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div onClick={() => onSelect(c.id)} style={{
            width: 30, height: 30, borderRadius: '50%', cursor: locked ? 'default' : 'pointer', background: c.hex,
            border: ativo === c.id ? '3px solid #22C55E' : (c.hex.toUpperCase() === '#EBEBEB' ? '2px solid #555' : '2px solid rgba(255,255,255,.1)'),
            transform: ativo === c.id ? 'scale(1.18)' : 'none',
            boxShadow: ativo === c.id ? '0 0 0 2px rgba(34,197,94,.25)' : 'none',
          }} />
          <div style={{ fontSize: '.58rem', color: '#2E4A6A', textAlign: 'center', maxWidth: 36, lineHeight: 1.2 }}>{c.label}</div>
        </div>
      ))}
    </div>
  )
}
