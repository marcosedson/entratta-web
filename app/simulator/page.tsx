'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface TextElement {
  id: string
  content: string
  color: string
  fontSize: number // 0.5 to 2.0
  posX: number // 0-100
  posY: number // 0-100
  fontFamily: 'bold' | 'light' | 'serif'
}

interface LogoElement {
  id: string
  src: string | null
  scale: number // 0.5 to 2.0
  posX: number // 0-100
  posY: number // 0-100
  removeBackground: boolean
}

interface BorderConfig {
  type: 'none' | 'thin' | 'double' | 'embossed_5cm'
  color: string
}

interface SimulatorState {
  medida: string
  corTapete: string
  border: BorderConfig
  textos: TextElement[]
  logos: LogoElement[]
  quantidade: number  // ← NOVO: quantidade de unidades
}

const MEDIDAS: Record<string, { w: number; c: number; label: string }> = {
  '40x60': { w: 0.4, c: 0.6, label: '40×60 cm' },
  '60x90': { w: 0.6, c: 0.9, label: '60×90 cm' },
  '80x120': { w: 0.8, c: 1.2, label: '80×120 cm' },
}

const CORES = [
  { id: 'preto', label: 'Preto', hex: '#1a1a1a' },
  { id: 'cinza', label: 'Cinza', hex: '#4a4a4a' },
  { id: 'verde', label: 'Verde', hex: '#15803D' },
  { id: 'azul', label: 'Azul', hex: '#0F2D52' },
  { id: 'vermelho', label: 'Vermelho', hex: '#991B1B' },
  { id: 'marrom', label: 'Marrom', hex: '#78350F' },
  { id: 'branco', label: 'Branco', hex: '#FFFFFF' },
  { id: 'dourado', label: 'Dourado', hex: '#B8860B' },
]

const CORES_TEXTO = CORES.filter(c => !['preto', 'cinza', 'marrom'].includes(c.id))

const DEFAULT_STATE: SimulatorState = {
  medida: '60x90',
  corTapete: 'preto',
  border: { type: 'thin', color: 'branco' },
  textos: [
    {
      id: 'txt_1',
      content: 'BEM-VINDO',
      color: 'branco',
      fontSize: 1.0,
      posX: 50,
      posY: 40,
      fontFamily: 'bold',
    },
  ],
  logos: [],
  quantidade: 1,  // ← NOVO
}

export default function SimulatorPage() {
  const [state, setState] = useState<SimulatorState>(DEFAULT_STATE)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const corTapeteObj = CORES.find(c => c.id === state.corTapete)!
  const borderColorObj = CORES.find(c => c.id === state.border.color)!

  const medidaObj = MEDIDAS[state.medida]
  const svgW = 400
  const svgH = Math.round(svgW / (medidaObj.w / medidaObj.c))

  // Add new text
  const addTexto = () => {
    const newText: TextElement = {
      id: `txt_${Date.now()}`,
      content: 'Novo Texto',
      color: 'branco',
      fontSize: 1.0,
      posX: 50,
      posY: 60,
      fontFamily: 'bold',
    }
    setState(prev => ({ ...prev, textos: [...prev.textos, newText] }))
  }

  // Remove text
  const removeTexto = (id: string) => {
    setState(prev => ({ ...prev, textos: prev.textos.filter(t => t.id !== id) }))
  }

  // Update text
  const updateTexto = (id: string, patch: Partial<TextElement>) => {
    setState(prev => ({
      ...prev,
      textos: prev.textos.map(t => (t.id === id ? { ...t, ...patch } : t)),
    }))
  }

  // Add logo
  const addLogo = () => {
    const newLogo: LogoElement = {
      id: `logo_${Date.now()}`,
      src: null,
      scale: 1.0,
      posX: 50,
      posY: 20,
      removeBackground: false,
    }
    setState(prev => ({ ...prev, logos: [...prev.logos, newLogo] }))
  }

  // Remove logo
  const removeLogo = (id: string) => {
    setState(prev => ({ ...prev, logos: prev.logos.filter(l => l.id !== id) }))
  }

  // Load logo image
  const loadLogoImage = (id: string, file: File) => {
    const reader = new FileReader()
    reader.onload = e => {
      setState(prev => ({
        ...prev,
        logos: prev.logos.map(l => (l.id === id ? { ...l, src: e.target?.result as string } : l)),
      }))
    }
    reader.readAsDataURL(file)
  }

  // Generate TAP files
  const handleGenerateTap = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/orders/gerar-tap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medida: state.medida,
          corTapete: state.corTapete,
          border: state.border,
          textos: state.textos,
          logos: state.logos,
          quantidade: state.quantidade,  // ← ENVIANDO QUANTIDADE
        }),
      })

      if (!response.ok) throw new Error('Erro ao gerar .TAP')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      alert('Erro: ' + (error instanceof Error ? error.message : 'Desconhecido'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', gap: '20px', padding: '20px', background: '#060E16' }}>
      {/* Left Panel: Config */}
      <div style={{ background: '#0B1520', borderRadius: '12px', padding: '20px', overflowY: 'auto', border: '1px solid rgba(34,197,94,0.15)' }}>
        <h2 style={{ color: '#22C55E', marginBottom: '20px' }}>Configurador Avançado (MVP)</h2>

        {/* Medida */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>MEDIDA</label>
          <select value={state.medida} onChange={e => setState(prev => ({ ...prev, medida: e.target.value }))} style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#E2E8F0' }}>
            {Object.entries(MEDIDAS).map(([key, m]) => (
              <option key={key} value={key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quantidade */}
        <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(34,197,94,0.05)', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.15)' }}>
          <label style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>QUANTIDADE DE UNIDADES</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setState(prev => ({ ...prev, quantidade: Math.max(1, prev.quantidade - 1) }))} style={{ padding: '6px 12px', background: 'rgba(34,197,94,0.2)', border: '1px solid #22C55E', color: '#22C55E', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              −
            </button>
            <input type="number" min="1" max="100" value={state.quantidade} onChange={e => setState(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#E2E8F0', textAlign: 'center', fontSize: '14px' }} />
            <button onClick={() => setState(prev => ({ ...prev, quantidade: Math.min(100, prev.quantidade + 1) }))} style={{ padding: '6px 12px', background: 'rgba(34,197,94,0.2)', border: '1px solid #22C55E', color: '#22C55E', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              +
            </button>
          </div>
          <p style={{ color: '#22C55E', fontSize: '12px', marginTop: '6px', fontWeight: 'bold' }}>
            {state.quantidade} × tapete = {state.quantidade} unidades
          </p>
        </div>

        {/* Cor Tapete */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>COR DO TAPETE</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {CORES.map(c => (
              <button key={c.id} onClick={() => setState(prev => ({ ...prev, corTapete: c.id }))} style={{ padding: '8px', background: c.hex, border: state.corTapete === c.id ? '2px solid #22C55E' : '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Border */}
        <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
          <label style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>BORDA</label>
          <select value={state.border.type} onChange={e => setState(prev => ({ ...prev, border: { ...prev.border, type: e.target.value as any } }))} style={{ width: '100%', padding: '8px', marginBottom: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#E2E8F0' }}>
            <option value="none">Sem Borda</option>
            <option value="thin">Borda Fina</option>
            <option value="double">Borda Dupla</option>
            <option value="embossed_5cm">Emborrachada 5cm</option>
          </select>
          {state.border.type !== 'none' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {CORES.slice(0, 6).map(c => (
                <button key={c.id} onClick={() => setState(prev => ({ ...prev, border: { ...prev.border, color: c.id } }))} style={{ padding: '6px', background: c.hex, border: state.border.color === c.id ? '2px solid #22C55E' : '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', cursor: 'pointer', fontSize: '9px' }}>
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Textos */}
        <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ color: '#22C55E', fontSize: '12px', fontWeight: 'bold' }}>TEXTOS ({state.textos.length})</label>
            <button onClick={addTexto} style={{ padding: '4px 8px', background: 'rgba(34,197,94,0.2)', border: '1px solid #22C55E', color: '#22C55E', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
              + Adicionar
            </button>
          </div>

          {state.textos.map((texto, idx) => (
            <div key={texto.id} style={{ marginBottom: '12px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8', fontSize: '11px' }}>Texto {idx + 1}</span>
                <button onClick={() => removeTexto(texto.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px' }}>
                  Remover
                </button>
              </div>

              <input type="text" value={texto.content} onChange={e => updateTexto(texto.id, { content: e.target.value })} placeholder="Conteúdo" style={{ width: '100%', padding: '6px', marginBottom: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#E2E8F0', fontSize: '12px' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                <div>
                  <label style={{ color: '#2E4A6A', fontSize: '10px' }}>Cor</label>
                  <select value={texto.color} onChange={e => updateTexto(texto.id, { color: e.target.value })} style={{ width: '100%', padding: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#E2E8F0', fontSize: '11px' }}>
                    {CORES_TEXTO.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#2E4A6A', fontSize: '10px' }}>Tamanho</label>
                  <input type="range" min="0.5" max="2" step="0.1" value={texto.fontSize} onChange={e => updateTexto(texto.id, { fontSize: parseFloat(e.target.value) })} style={{ width: '100%', accentColor: '#22C55E', cursor: 'pointer' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div>
                  <label style={{ color: '#2E4A6A', fontSize: '10px' }}>Pos X: {texto.posX}%</label>
                  <input type="range" min="0" max="100" value={texto.posX} onChange={e => updateTexto(texto.id, { posX: parseInt(e.target.value) })} style={{ width: '100%', accentColor: '#22C55E' }} />
                </div>
                <div>
                  <label style={{ color: '#2E4A6A', fontSize: '10px' }}>Pos Y: {texto.posY}%</label>
                  <input type="range" min="0" max="100" value={texto.posY} onChange={e => updateTexto(texto.id, { posY: parseInt(e.target.value) })} style={{ width: '100%', accentColor: '#22C55E' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos */}
        <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ color: '#22C55E', fontSize: '12px', fontWeight: 'bold' }}>LOGOS ({state.logos.length})</label>
            <button onClick={addLogo} style={{ padding: '4px 8px', background: 'rgba(34,197,94,0.2)', border: '1px solid #22C55E', color: '#22C55E', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
              + Adicionar
            </button>
          </div>

          {state.logos.map((logo, idx) => (
            <div key={logo.id} style={{ marginBottom: '12px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8', fontSize: '11px' }}>Logo {idx + 1}</span>
                <button onClick={() => removeLogo(logo.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px' }}>
                  Remover
                </button>
              </div>

              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && loadLogoImage(logo.id, e.target.files[0])} style={{ width: '100%', marginBottom: '6px', fontSize: '11px' }} />

              {logo.src && <div style={{ height: '40px', marginBottom: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt="Logo enviado pelo usuário para simulação no capacho" style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '3px' }} />
              </div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                <div>
                  <label style={{ color: '#2E4A6A', fontSize: '10px' }}>Escala: {(logo.scale * 100).toFixed(0)}%</label>
                  <input type="range" min="0.3" max="2" step="0.1" value={logo.scale} onChange={e => setState(prev => ({ ...prev, logos: prev.logos.map(l => (l.id === logo.id ? { ...l, scale: parseFloat(e.target.value) } : l)) }))} style={{ width: '100%', accentColor: '#22C55E', cursor: 'pointer' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div>
                  <label style={{ color: '#2E4A6A', fontSize: '10px' }}>Pos X: {logo.posX}%</label>
                  <input type="range" min="0" max="100" value={logo.posX} onChange={e => setState(prev => ({ ...prev, logos: prev.logos.map(l => (l.id === logo.id ? { ...l, posX: parseInt(e.target.value) } : l)) }))} style={{ width: '100%', accentColor: '#22C55E' }} />
                </div>
                <div>
                  <label style={{ color: '#2E4A6A', fontSize: '10px' }}>Pos Y: {logo.posY}%</label>
                  <input type="range" min="0" max="100" value={logo.posY} onChange={e => setState(prev => ({ ...prev, logos: prev.logos.map(l => (l.id === logo.id ? { ...l, posY: parseInt(e.target.value) } : l)) }))} style={{ width: '100%', accentColor: '#22C55E' }} />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', cursor: 'pointer', color: '#94A3B8', fontSize: '11px' }}>
                <input type="checkbox" checked={logo.removeBackground} onChange={e => setState(prev => ({ ...prev, logos: prev.logos.map(l => (l.id === logo.id ? { ...l, removeBackground: e.target.checked } : l)) }))} />
                Remover fundo branco
              </label>
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <button onClick={handleGenerateTap} disabled={generating} style={{ width: '100%', padding: '12px', background: generating ? '#666' : 'linear-gradient(135deg,#22C55E,#15803D)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
          {generating ? '⏳ Gerando...' : '🚀 Gerar .TAP Files'}
        </button>
      </div>

      {/* Right Panel: Preview + Result */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Preview */}
        <div style={{ background: '#0B1520', borderRadius: '12px', padding: '20px', border: '1px solid rgba(34,197,94,0.15)' }}>
          <h3 style={{ color: '#22C55E', marginBottom: '12px' }}>Preview</h3>
          <svg ref={svgRef} width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', background: corTapeteObj.hex, display: 'block', margin: '0 auto' }}>
            {/* Border */}
            {state.border.type === 'thin' && <rect x={10} y={10} width={svgW - 20} height={svgH - 20} fill="none" stroke={borderColorObj.hex} strokeWidth={2} />}
            {state.border.type === 'double' && (
              <>
                <rect x={8} y={8} width={svgW - 16} height={svgH - 16} fill="none" stroke={borderColorObj.hex} strokeWidth={3} />
                <rect x={15} y={15} width={svgW - 30} height={svgH - 30} fill="none" stroke={borderColorObj.hex} strokeWidth={1} />
              </>
            )}
            {state.border.type === 'embossed_5cm' && <rect x={20} y={20} width={svgW - 40} height={svgH - 40} fill="none" stroke={borderColorObj.hex} strokeWidth={8} rx={4} opacity={0.5} />}

            {/* Textos */}
            {state.textos.map(texto => {
              const textColor = CORES.find(c => c.id === texto.color)?.hex ?? '#fff'
              const fontSize = 12 * texto.fontSize
              const x = (svgW * texto.posX) / 100
              const y = (svgH * texto.posY) / 100
              return (
                <text key={texto.id} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={textColor} fontSize={fontSize} fontWeight={texto.fontFamily === 'bold' ? 'bold' : 'normal'} fontFamily={texto.fontFamily === 'serif' ? 'Georgia' : 'Arial'}>
                  {texto.content}
                </text>
              )
            })}

            {/* Logos */}
            {state.logos.map(logo => {
              if (!logo.src) return null
              const logoW = 60 * logo.scale
              const logoH = 40 * logo.scale
              const x = (svgW * logo.posX) / 100 - logoW / 2
              const y = (svgH * logo.posY) / 100 - logoH / 2
              return <image key={logo.id} href={logo.src} x={x} y={y} width={logoW} height={logoH} preserveAspectRatio="xMidYMid meet" opacity={0.9} />
            })}
          </svg>
        </div>

        {/* Result */}
        {result && (
          <div style={{ background: '#0B1520', borderRadius: '12px', padding: '20px', border: '1px solid rgba(34,197,94,0.15)', maxHeight: '400px', overflowY: 'auto' }}>
            <h3 style={{ color: '#22C55E', marginBottom: '12px' }}>✓ Arquivos Gerados</h3>
            <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', color: '#4ADE80', fontSize: '11px', overflowX: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

