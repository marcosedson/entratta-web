'use client'

import { CORES_PINTURA, FONTES, TextoItem } from '../types'
import { CoresRow, Section, chipBtnBase, inputStyle } from './ui'

interface Props {
  textos: TextoItem[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<TextoItem>) => void
  onRemove: (id: string) => void
}

export function PainelTextos({ textos, onAdd, onUpdate, onRemove }: Props) {
  return (
    <Section title="Textos personalizados">
      {textos.map((t, i) => (
        <div key={t.id} style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '.65rem', color: '#4ADE80', fontWeight: 700 }}>Texto {i + 1}</span>
            <button onClick={() => onRemove(t.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '.65rem', cursor: 'pointer' }}>✕ Remover</button>
          </div>
          <input type="text" placeholder="Digite o texto..." maxLength={40} value={t.texto} onChange={e => onUpdate(t.id, { texto: e.target.value })} style={{ ...inputStyle, marginBottom: 6 }} />
          <div style={{ fontSize: '.6rem', color: '#2E4A6A', marginBottom: 6 }}>{t.texto.length}/40</div>
          <div style={{ fontSize: '.55rem', color: '#2E4A6A', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Fonte</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
            {FONTES.map(f => (
              <button key={f.id} onClick={() => onUpdate(t.id, { fonteId: f.id })} style={{
                ...chipBtnBase, fontFamily: f.f,
                border: `1.5px solid ${t.fonteId === f.id ? '#22C55E' : 'rgba(255,255,255,.07)'}`,
                background: t.fonteId === f.id ? 'rgba(34,197,94,.1)' : 'transparent',
                color: t.fonteId === f.id ? '#22C55E' : '#94A3B8',
              }}>{f.l}</button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
            <span style={{ fontSize: '.55rem', color: '#2E4A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Tamanho</span>
            <span style={{ fontSize: '.62rem', color: '#22C55E', fontWeight: 700 }}>{t.tamanho === 0 ? 'Auto' : t.tamanho + 'px'}</span>
          </div>
          <input type="range" min={0} max={80} value={t.tamanho} onChange={e => onUpdate(t.id, { tamanho: Number(e.target.value) })} style={{ width: '100%', accentColor: '#22C55E', cursor: 'pointer', height: 4, marginBottom: 8 }} />
          <div style={{ fontSize: '.55rem', color: '#2E4A6A', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Cor da tinta</div>
          <CoresRow cores={CORES_PINTURA} ativo={String(t.aci)} onSelect={id => onUpdate(t.id, { aci: Number(id) })} />
          <div style={{ fontSize: '.58rem', color: '#1E3550', textAlign: 'center', marginTop: 6 }}>✋ Arraste no preview para posicionar</div>
        </div>
      ))}
      <button onClick={onAdd} style={{ width: '100%', padding: '9px 14px', borderRadius: 8, cursor: 'pointer', outline: 'none', border: '1.5px dashed rgba(34,197,94,.3)', background: 'rgba(34,197,94,.04)', color: '#22C55E', fontSize: '.75rem', fontWeight: 700 }}>
        + Adicionar texto
      </button>
    </Section>
  )
}
