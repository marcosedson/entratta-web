'use client'

import { useRef } from 'react'

import { aciByCode } from '@/lib/constants/aci-palette'

import { LogoItem } from '../types'

// TODO: '../types' não exporta CORES_PINTURA ainda — placeholder vazio pra destravar build
const CORES_PINTURA: { aci: string; label: string; hex: string }[] = []
import { Section, rotBtnStyle } from './ui'

interface Props {
  logos: LogoItem[]
  onAdd: (file: File) => void
  onUpdate: (id: string, patch: Partial<LogoItem>) => void
  onRemove: (id: string) => void
  onRegiaoAci: (logoId: string, regiaoIndex: number, aci: number) => void
}

export function PainelLogos({ logos, onAdd, onUpdate, onRemove, onRegiaoAci }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <Section title="Logos (vetorizados para pintura)">
      {logos.map((lg, i) => {
        const rotExibe = lg.rotacao > 180 ? lg.rotacao - 360 : lg.rotacao
        return (
          <div key={lg.id} style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '.65rem', color: '#4ADE80', fontWeight: 700 }}>
                Logo {i + 1}
                {lg.vetorizando && <span style={{ marginLeft: 6, fontSize: '.6rem', color: '#EAB308' }}>⏳ Vetorizando...</span>}
              </span>
              <button onClick={() => onRemove(lg.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '.65rem', cursor: 'pointer' }}>✕</button>
            </div>
            {/* thumbnail do upload (dataURL) — next/image não se aplica */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lg.src} style={{ height: 38, borderRadius: 4, objectFit: 'contain', background: 'rgba(255,255,255,.05)', marginBottom: 8 }} alt="Logo enviado para o capacho" />

            {lg.vetor && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '.55rem', color: '#2E4A6A', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Cores de tinta por região ({lg.vetor.regioes.length})
                </div>
                {lg.vetor.regioes.map((r, ri) => (
                  <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '.6rem', color: '#64748B', width: 52 }}>Região {ri + 1}</span>

                    {/* original color swatch */}
                    <div title={r.cor_original ?? ''} style={{ width: 22, height: 22, borderRadius: 4, background: r.cor_original ?? 'transparent', border: '1px solid rgba(255,255,255,.12)' }} />

                    <div style={{ display: 'flex', gap: 5 }}>
                      {CORES_PINTURA.map(c => (
                        <div
                          key={c.aci}
                          onClick={() => onRegiaoAci(lg.id, ri, c.aci)}
                          title={c.label}
                          style={{
                            width: 20, height: 20, borderRadius: '50%', cursor: 'pointer', background: c.hex,
                            border: r.aci === c.aci ? '2.5px solid #22C55E' : '1.5px solid rgba(255,255,255,.15)',
                            transform: r.aci === c.aci ? 'scale(1.15)' : 'none',
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '.58rem', color: '#4ADE80' }}>{aciByCode(r.aci)?.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: '.62rem', color: '#2E4A6A' }}>Tamanho</span>
              <span style={{ fontSize: '.62rem', color: '#22C55E', fontWeight: 700 }}>{lg.scale}%</span>
            </div>
            <input type="range" min={30} max={190} value={lg.scale} onChange={e => onUpdate(lg.id, { scale: Number(e.target.value) })} style={{ width: '100%', accentColor: '#22C55E', cursor: 'pointer', height: 4 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, marginBottom: 4 }}>
              <span style={{ fontSize: '.62rem', color: '#2E4A6A' }}>Rotação</span>
              <span style={{ fontSize: '.68rem', color: '#22C55E', fontWeight: 800 }}>{rotExibe}°</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => onUpdate(lg.id, { rotacao: (lg.rotacao - 15 + 360) % 360 })} style={rotBtnStyle}>↺ −15°</button>
              <button onClick={() => onUpdate(lg.id, { rotacao: 0 })} style={rotBtnStyle}>Reset</button>
              <button onClick={() => onUpdate(lg.id, { rotacao: (lg.rotacao + 15) % 360 })} style={rotBtnStyle}>+15° ↻</button>
            </div>
            <div style={{ fontSize: '.58rem', color: '#1E3550', textAlign: 'center', marginTop: 6 }}>✋ Arraste no preview</div>
          </div>
        )
      })}
      <input type="file" accept="image/png,image/jpeg,image/svg+xml" style={{ display: 'none' }} ref={fileRef} onChange={e => { const f = e.target.files?.[0]; if (f) onAdd(f); e.target.value = '' }} />
      <button onClick={() => fileRef.current?.click()} style={{ width: '100%', padding: '9px 14px', borderRadius: 8, cursor: 'pointer', outline: 'none', border: '1.5px dashed rgba(34,197,94,.3)', background: 'rgba(34,197,94,.04)', color: '#22C55E', fontSize: '.75rem', fontWeight: 700 }}>
        + Adicionar logo (PNG, JPG, SVG)
      </button>
      <p style={{ fontSize: '.6rem', color: '#2E4A6A', marginTop: 6, lineHeight: 1.5 }}>
        O logo é convertido para as 5 cores de tinta da produção. Ajuste a cor de cada região acima.
      </p>
    </Section>
  )
}
