'use client'

interface Props {
  url: string
  onClose: () => void
}

/** Prévia oficial de produção — render determinístico do serviço (textura real). */
export function ModalPrevia({ url, onClose }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(3,8,14,.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0B1520', border: '1px solid rgba(34,197,94,.25)', borderRadius: 16,
          padding: 20, maxWidth: 720, width: '100%', maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: '.8rem', fontWeight: 800, color: '#22C55E' }}>PRÉVIA OFICIAL DE PRODUÇÃO</div>
            <div style={{ fontSize: '.68rem', color: '#94A3B8', marginTop: 2 }}>
              Gerada com a textura real do capacho — é exatamente isto que será pintado.
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.1rem', cursor: 'pointer' }}>✕</button>
        </div>
        {/* prévia vem do serviço como PNG dinâmico (objectURL) — next/image não se aplica */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Prévia fotorrealista do capacho" style={{ width: '100%', borderRadius: 10, display: 'block' }} />
        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 14, padding: '12px 16px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg,#22C55E,#15803D)', color: '#fff',
            fontSize: '.85rem', fontWeight: 800, cursor: 'pointer',
          }}
        >
          Fechar e revisar aprovação
        </button>
      </div>
    </div>
  )
}
