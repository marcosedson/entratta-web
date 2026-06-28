'use client'

import { useState, useRef, useEffect, useMemo, useId, useCallback } from 'react'

// ── DATA ──────────────────────────────────────────────────────────────────────

const CORES_TAPETE = [
  { id: 'preto', label: 'Preto', hex: '#1a1a1a' },
  { id: 'cinza', label: 'Cinza', hex: '#4a4a4a' },
  { id: 'verde', label: 'Verde', hex: '#15803D' },
  { id: 'azul', label: 'Azul', hex: '#0F2D52' },
  { id: 'vermelho', label: 'Vermelho', hex: '#991B1B' },
  { id: 'marrom', label: 'Marrom', hex: '#78350F' },
  { id: 'bege', label: 'Bege', hex: '#D4B896' },
]

const CORES_TEXTO = [
  { id: 'branco', label: 'Branco', hex: '#FFFFFF' },
  { id: 'verde', label: 'Verde', hex: '#22C55E' },
  { id: 'amarelo', label: 'Amarelo', hex: '#EAB308' },
  { id: 'vermelho', label: 'Vermelho', hex: '#EF4444' },
  { id: 'azul', label: 'Azul', hex: '#3B82F6' },
  { id: 'preto', label: 'Preto', hex: '#111111' },
]

const CORES_BORDA = [
  { id: 'branco', label: 'Branco', hex: '#FFFFFF' },
  { id: 'verde', label: 'Verde', hex: '#22C55E' },
  { id: 'amarelo', label: 'Amarelo', hex: '#EAB308' },
  { id: 'vermelho', label: 'Vermelho', hex: '#EF4444' },
  { id: 'azul', label: 'Azul', hex: '#3B82F6' },
  { id: 'preto', label: 'Preto', hex: '#111111' },
  { id: 'ouro', label: 'Ouro', hex: '#B8860B' },
]

const MEDIDAS: Record<string, { l: string; w: number; c: number }> = {
  '40x60': { l: '40×60 cm', w: 0.4, c: 0.6 },
  '50x80': { l: '50×80 cm', w: 0.5, c: 0.8 },
  '60x90': { l: '60×90 cm', w: 0.6, c: 0.9 },
  '80x120': { l: '80×120 cm', w: 0.8, c: 1.2 },
  '100x150': { l: '100×150 cm', w: 1.0, c: 1.5 },
  custom: { l: 'Sob medida', w: 0, c: 0 },
}

const BORDAS = [
  { id: 'sem', l: 'Sem borda' },
  { id: 'fina', l: 'Borda fina' },
  { id: 'dupla', l: 'Borda dupla' },
]

const FONTES = [
  { id: 'bold', l: 'Bold', f: 'Inter, sans-serif', w: '800' },
  { id: 'light', l: 'Clean', f: 'Inter, sans-serif', w: '300' },
  { id: 'serif', l: 'Elegante', f: 'Georgia, serif', w: '700' },
]

const WPP = '5564992066855'
const SNAP = 14
const PAD = 18

// ── STATE ─────────────────────────────────────────────────────────────────────

interface State {
  medida: string
  corTapete: string
  corTexto: string
  corBorda: string
  texto: string
  borda: string
  fonte: string
  logoSrc: string | null
  customL: string
  customC: string
  nome: string
  wpp: string
  logoRotacao: number
  logoX: number | null
  logoY: number | null
  logoScale: number
  textoX: number | null
  textoY: number | null
}

const DEFAULT: State = {
  medida: '60x90',
  corTapete: 'preto',
  corTexto: 'branco',
  corBorda: 'branco',
  texto: '',
  borda: 'sem',
  fonte: 'bold',
  logoSrc: null,
  customL: '',
  customC: '',
  nome: '',
  wpp: '',
  logoRotacao: 0,
  logoX: null,
  logoY: null,
  logoScale: 1.0,
  textoX: null,
  textoY: null,
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function ColorChip({
  hex,
  label,
  active,
  onClick,
  isLight,
}: {
  hex: string
  label: string
  active: boolean
  onClick: () => void
  isLight?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        title={label}
        className="w-8 h-8 rounded-full transition-all duration-150 flex-shrink-0"
        style={{
          background: hex,
          border: active
            ? '3px solid #22C55E'
            : isLight
            ? '2px solid #555'
            : '2px solid rgba(255,255,255,0.12)',
          transform: active ? 'scale(1.18)' : 'scale(1)',
          boxShadow: active ? '0 0 0 2px rgba(34,197,94,0.25)' : 'none',
        }}
      />
      <span style={{ fontSize: '0.58rem', color: '#2E4A6A', textAlign: 'center', maxWidth: '36px', lineHeight: 1.2 }}>
        {label}
      </span>
    </div>
  )
}

function SecTitle({ children }: { children: React.ReactNode }) {
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

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export function Configurator() {
  const uid = useId()
  const patternId = `vinyl-${uid.replace(/:/g, '')}`
  const patternLightId = `vinyl-light-${uid.replace(/:/g, '')}`

  const [s, setS] = useState<State>(DEFAULT)
  const [svgW, setSvgW] = useState(460)
  const [snapGuides, setSnapGuides] = useState({ v: false, h: false })
  const [copied, setCopied] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef({ active: false, target: '', svgX0: 0, svgY0: 0, startX: 0, startY: 0 })

  // Refs to avoid stale closures in drag handlers
  const svgDimsRef = useRef({ w: svgW, h: 0 })
  const stateRef = useRef(s)
  useEffect(() => { stateRef.current = s }, [s])

  // ── Responsive SVG width
  useEffect(() => {
    const update = () => {
      const w = Math.min(460, window.innerWidth - 60)
      setSvgW(w)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // ── Compute SVG dimensions
  const { svgH, medidaLabel } = useMemo(() => {
    let l: number, c: number
    if (s.medida === 'custom') {
      l = parseFloat(s.customL) || 60
      c = parseFloat(s.customC) || 90
    } else {
      const m = MEDIDAS[s.medida]
      l = m.w * 100
      c = m.c * 100
    }
    // Always landscape
    let dL = l, dC = c
    if (dL < dC) { const t = dL; dL = dC; dC = t }
    const H = Math.round(svgW / (dL / dC))
    const label =
      s.medida === 'custom'
        ? `${s.customL || '?'}×${s.customC || '?'} cm`
        : MEDIDAS[s.medida].l
    return { svgH: H, medidaLabel: label }
  }, [s.medida, s.customL, s.customC, svgW])

  // Keep dims ref updated
  useEffect(() => { svgDimsRef.current = { w: svgW, h: svgH } }, [svgW, svgH])

  // ── Price
  const preco = useMemo(() => {
    if (s.medida === 'custom') {
      const l = parseFloat(s.customL) || 0
      const c = parseFloat(s.customC) || 0
      return l > 0 && c > 0 ? Math.round((l / 100) * (c / 100) * 300) : null
    }
    const m = MEDIDAS[s.medida]
    return Math.round(m.w * m.c * 300)
  }, [s.medida, s.customL, s.customC])

  // ── Computed colors/objects
  const corTapeteObj = CORES_TAPETE.find(c => c.id === s.corTapete)!
  const corTextoObj = CORES_TEXTO.find(c => c.id === s.corTexto)!
  const fonteObj = FONTES.find(f => f.id === s.fonte)!
  const isLight = ['bege', 'cinza'].includes(s.corTapete)
  const bordaHex = CORES_BORDA.find(c => c.id === s.corBorda)?.hex ?? '#FFFFFF'

  // ── Logo SVG dims
  const logoDims = useMemo(() => {
    if (!s.logoSrc) return null
    const baseLW = Math.min(130, svgW * 0.32)
    const baseLH = Math.min(90, svgH * 0.38)
    const lw = baseLW * s.logoScale
    const lh = baseLH * s.logoScale
    const cx = s.logoX !== null ? s.logoX : svgW / 2
    const cy = s.logoY !== null ? s.logoY : s.texto ? svgH / 2 - lh / 2 - 10 : svgH / 2
    return { x: cx - lw / 2, y: cy - lh / 2, w: lw, h: lh, cx, cy }
  }, [s.logoSrc, s.logoX, s.logoY, s.logoScale, svgW, svgH, s.texto])

  // ── Text SVG dims
  const textoDims = useMemo(() => {
    if (!s.texto) return null
    const maxFont = Math.min(42, Math.max(12, Math.floor(svgW / (s.texto.length * 0.6 + 1))))
    const tx = s.textoX !== null ? s.textoX : svgW / 2
    const ty = s.textoY !== null ? s.textoY : s.logoSrc ? svgH * 0.76 : svgH / 2
    const estW = Math.min(svgW - 20, maxFont * s.texto.length * 0.62 + 16)
    const estH = maxFont * 1.5
    return { x: tx, y: ty, fontSize: maxFont, estW, estH }
  }, [s.texto, s.textoX, s.textoY, svgW, svgH, s.logoSrc])

  // ── WhatsApp URL
  const wppUrl = useMemo(() => {
    const corBordaLabel = CORES_BORDA.find(c => c.id === s.corBorda)?.label ?? s.corBorda
    const bordaObj = BORDAS.find(b => b.id === s.borda)!
    const msg = `Olá! Quero montar meu capacho personalizado 🚪\n\n👤 Nome: ${s.nome || 'não informado'}\n📐 Medida: ${medidaLabel}\n🎨 Cor do tapete: ${corTapeteObj.label}\n✏️ Texto: ${s.texto || 'sem texto'}\n🖊️ Cor do texto: ${corTextoObj.label}\n🔲 Borda: ${bordaObj.l}${s.borda !== 'sem' ? ` — Cor: ${corBordaLabel}` : ''}\n🖼️ Logo: ${s.logoSrc ? 'SIM — envio no próximo passo' : 'não'}\n💰 Preço estimado: ${preco ? `R$ ${preco.toLocaleString('pt-BR')}` : 'a calcular'}\n\nAguardo o orçamento! 😊`
    return `https://wa.me/${WPP}?text=${encodeURIComponent(msg)}`
  }, [s, medidaLabel, corTapeteObj, corTextoObj, preco])

  // ── getSVGPt (reads from ref to avoid stale closure)
  const getSVGPt = useCallback((e: MouseEvent | TouchEvent) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const r = svg.getBoundingClientRect()
    const { w, h } = svgDimsRef.current
    const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
    const cy = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
    return { x: (cx - r.left) / r.width * w, y: (cy - r.top) / r.height * h }
  }, [])

  // ── Drag handlers (stable — reads fresh values via refs)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const onDown = (e: MouseEvent | TouchEvent) => {
      const tgt = (e.target as Element).getAttribute('data-drag')
      if (!tgt) return
      e.preventDefault()
      const pt = getSVGPt(e)
      const { w, h } = svgDimsRef.current
      const cur = stateRef.current
      dragRef.current = {
        active: true,
        target: tgt,
        svgX0: pt.x,
        svgY0: pt.y,
        startX: tgt === 'logo' ? (cur.logoX ?? w / 2) : (cur.textoX ?? w / 2),
        startY: tgt === 'logo' ? (cur.logoY ?? h / 2) : (cur.textoY ?? h / 2),
      }
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current.active) return
      e.preventDefault()
      const pt = getSVGPt(e)
      const { w, h } = svgDimsRef.current
      let nx = dragRef.current.startX + (pt.x - dragRef.current.svgX0)
      let ny = dragRef.current.startY + (pt.y - dragRef.current.svgY0)
      nx = Math.max(20, Math.min(w - 20, nx))
      ny = Math.max(20, Math.min(h - 20, ny))
      const snapX = Math.abs(nx - w / 2) < SNAP
      const snapY = Math.abs(ny - h / 2) < SNAP
      if (snapX) nx = w / 2
      if (snapY) ny = h / 2
      setSnapGuides({ v: snapX, h: snapY })
      if (dragRef.current.target === 'logo') {
        setS(prev => ({ ...prev, logoX: nx, logoY: ny }))
      } else {
        setS(prev => ({ ...prev, textoX: nx, textoY: ny }))
      }
    }

    const onUp = () => {
      if (!dragRef.current.active) return
      dragRef.current.active = false
      setSnapGuides({ v: false, h: false })
    }

    svg.addEventListener('mousedown', onDown)
    svg.addEventListener('touchstart', onDown, { passive: false })
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)

    return () => {
      svg.removeEventListener('mousedown', onDown)
      svg.removeEventListener('touchstart', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [getSVGPt])

  // ── Handlers
  const set = (patch: Partial<State>) => setS(prev => ({ ...prev, ...patch }))

  const loadLogo = (file: File) => {
    const r = new FileReader()
    r.onload = e => {
      set({ logoSrc: e.target?.result as string, logoX: null, logoY: null })
    }
    r.readAsDataURL(file)
  }

  const removeLogo = () => set({ logoSrc: null, logoX: null, logoY: null, logoScale: 1, logoRotacao: 0 })

  const rotLogo = (delta: number, modo?: 'reset') => {
    if (modo === 'reset') { set({ logoRotacao: 0 }); return }
    set({ logoRotacao: ((s.logoRotacao + delta) % 360 + 360) % 360 })
  }

  const copiarMsg = async () => {
    const bordaObj = BORDAS.find(b => b.id === s.borda)!
    const msg = `ENTRATTA Capachos — Pedido\nMedida: ${medidaLabel}\nCor: ${corTapeteObj.label}\nTexto: ${s.texto || '—'}\nLogo: ${s.logoSrc ? 'Sim' : 'Não'}\nPreço estimado: ${preco ? 'R$' + preco : 'a calcular'}\nBorda: ${bordaObj.l}\nWhatsApp: (64) 99206-6855`
    try {
      await navigator.clipboard.writeText(msg)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {}
  }

  // Panel input style
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '9px 11px',
    color: '#E2E8F0',
    fontSize: '0.82rem',
    fontFamily: 'inherit',
    outline: 'none',
  }

  const secStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '11px',
    padding: '13px 14px',
    marginBottom: '10px',
  }

  const medBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '9px 6px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: active ? '1.5px solid #22C55E' : '1.5px solid rgba(255,255,255,0.07)',
    background: active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
    color: active ? '#22C55E' : '#94A3B8',
    fontSize: '0.75rem',
    fontWeight: 600,
    textAlign: 'center',
    position: 'relative',
    transition: 'all .15s',
  })

  const bordaBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '7px 4px',
    borderRadius: '7px',
    cursor: 'pointer',
    border: active ? '1.5px solid #22C55E' : '1.5px solid rgba(255,255,255,0.07)',
    background: active ? 'rgba(34,197,94,0.1)' : 'transparent',
    color: active ? '#22C55E' : '#94A3B8',
    fontSize: '0.7rem',
    fontWeight: 600,
    transition: 'all .15s',
  })

  const fonteBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    border: active ? '1.5px solid #22C55E' : '1.5px solid rgba(255,255,255,0.07)',
    background: active ? 'rgba(34,197,94,0.1)' : 'transparent',
    color: active ? '#22C55E' : '#94A3B8',
    fontSize: '0.7rem',
    fontWeight: 600,
    transition: 'all .15s',
  })

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        minHeight: 'calc(100vh - 64px)',
        background: '#060E16',
      }}
      className="max-[720px]:!block"
    >
      {/* ── PANEL ── */}
      <div
        style={{
          background: '#0B1520',
          borderRight: '1px solid rgba(34,197,94,0.15)',
          padding: '16px 14px 32px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 64px)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(34,197,94,0.2) transparent',
        }}
      >
        {/* Dados */}
        <div style={secStyle}>
          <SecTitle>Seus dados</SecTitle>
          <input
            type="text"
            placeholder="Seu nome ou empresa"
            value={s.nome}
            onChange={e => set({ nome: e.target.value })}
            style={{ ...inputStyle, marginBottom: '8px' }}
          />
          <input
            type="tel"
            placeholder="WhatsApp com DDD"
            value={s.wpp}
            onChange={e => set({ wpp: e.target.value })}
            style={inputStyle}
          />
        </div>

        {/* Medida */}
        <div style={secStyle}>
          <SecTitle>Medida do capacho</SecTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
            {Object.entries(MEDIDAS).map(([key, m]) => (
              <button
                key={key}
                onClick={() => set({ medida: key })}
                style={medBtnStyle(s.medida === key)}
              >
                {m.l}
                {(key === '60x90' || key === '80x120') && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-4px',
                      background: '#22C55E',
                      color: '#000',
                      fontSize: '0.52rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '5px',
                    }}
                  >
                    POP
                  </span>
                )}
              </button>
            ))}
          </div>

          {s.medida === 'custom' && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                type="text"
                placeholder="Largura (cm)"
                maxLength={4}
                value={s.customL}
                onChange={e => set({ customL: e.target.value })}
                style={{ ...inputStyle, textAlign: 'center' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', color: '#4B6A8A', fontSize: '1.1rem' }}>×</span>
              <input
                type="text"
                placeholder="Comprim. (cm)"
                maxLength={4}
                value={s.customC}
                onChange={e => set({ customC: e.target.value })}
                style={{ ...inputStyle, textAlign: 'center' }}
              />
            </div>
          )}

          {preco && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: '10px',
                padding: '8px 14px',
                fontWeight: 800,
                fontSize: '1.1rem',
                color: '#22C55E',
                marginTop: '10px',
                fontFamily: 'monospace',
              }}
            >
              💰 R$ {preco.toLocaleString('pt-BR')}
              <span style={{ fontSize: '0.65rem', fontWeight: 400, color: '#4ADE80' }}>tapete pronto</span>
            </div>
          )}
        </div>

        {/* Cor tapete */}
        <div style={secStyle}>
          <SecTitle>Cor do tapete</SecTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center' }}>
            {CORES_TAPETE.map(c => (
              <ColorChip
                key={c.id}
                hex={c.hex}
                label={c.label}
                active={s.corTapete === c.id}
                onClick={() => set({ corTapete: c.id })}
                isLight={c.id === 'bege'}
              />
            ))}
          </div>
        </div>

        {/* Texto */}
        <div style={secStyle}>
          <SecTitle>Texto personalizado</SecTitle>
          <input
            type="text"
            placeholder="BEM-VINDO · SEU NOME · CLÍNICA"
            maxLength={40}
            value={s.texto}
            onChange={e => set({ texto: e.target.value, textoX: null, textoY: null })}
            style={{ ...inputStyle, marginBottom: '8px' }}
          />
          <div style={{ fontSize: '0.65rem', color: '#2E4A6A', marginBottom: '8px' }}>
            {s.texto.length}/40 caracteres
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FONTES.map(f => (
              <button key={f.id} onClick={() => set({ fonte: f.id })} style={fonteBtnStyle(s.fonte === f.id)}>
                {f.l}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.62rem', color: '#1E3550', textAlign: 'center', marginTop: '8px' }}>
            ✋ Arraste o texto no preview para mover
          </div>
        </div>

        {/* Cor texto */}
        <div style={secStyle}>
          <SecTitle>Cor do texto</SecTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center' }}>
            {CORES_TEXTO.map(c => (
              <ColorChip
                key={c.id}
                hex={c.hex}
                label={c.label}
                active={s.corTexto === c.id}
                onClick={() => set({ corTexto: c.id })}
                isLight={c.id === 'branco'}
              />
            ))}
          </div>
        </div>

        {/* Borda */}
        <div style={secStyle}>
          <SecTitle>Acabamento</SecTitle>
          <div style={{ display: 'flex', gap: '7px' }}>
            {BORDAS.map(b => (
              <button key={b.id} onClick={() => set({ borda: b.id })} style={bordaBtnStyle(s.borda === b.id)}>
                {b.l}
              </button>
            ))}
          </div>
        </div>

        {/* Cor borda */}
        {s.borda !== 'sem' && (
          <div style={secStyle}>
            <SecTitle>Cor da borda</SecTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center' }}>
              {CORES_BORDA.map(c => (
                <ColorChip
                  key={c.id}
                  hex={c.hex}
                  label={c.label}
                  active={s.corBorda === c.id}
                  onClick={() => set({ corBorda: c.id })}
                  isLight={c.id === 'branco'}
                />
              ))}
            </div>
          </div>
        )}

        {/* Logo */}
        <div style={secStyle}>
          <SecTitle>Logo da empresa (opcional)</SecTitle>
          <input
            type="file"
            id="file-logo-conf"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && loadLogo(e.target.files[0])}
          />
          {!s.logoSrc ? (
            <button
              onClick={() => document.getElementById('file-logo-conf')?.click()}
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1.5px dashed rgba(34,197,94,0.3)',
                background: 'rgba(34,197,94,0.04)',
                color: '#22C55E',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              ⬆ Enviar logo (PNG, JPG, SVG)
            </button>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.logoSrc} alt="Logo do usuário enviado para personalização do capacho" style={{ height: '38px', borderRadius: '4px', objectFit: 'contain' }} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => document.getElementById('file-logo-conf')?.click()}
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '0.68rem', cursor: 'pointer' }}
                  >
                    Trocar
                  </button>
                  <button
                    onClick={removeLogo}
                    style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '0.68rem', cursor: 'pointer' }}
                  >
                    Remover
                  </button>
                </div>
              </div>

              {/* Scale */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.62rem', color: '#2E4A6A', fontWeight: 600 }}>Tamanho</span>
                  <span style={{ fontSize: '0.62rem', color: '#22C55E', fontWeight: 700 }}>
                    {Math.round(s.logoScale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={190}
                  value={Math.round(s.logoScale * 100)}
                  onChange={e => set({ logoScale: parseInt(e.target.value) / 100 })}
                  style={{ width: '100%', accentColor: '#22C55E', cursor: 'pointer', height: '4px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', color: '#1E3A5C' }}>
                  <span>Menor</span><span>Maior</span>
                </div>
              </div>

              {/* Rotation */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.62rem', color: '#2E4A6A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Rotação
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#22C55E', fontWeight: 800 }}>
                    {((s.logoRotacao > 180 ? s.logoRotacao - 360 : s.logoRotacao))}°
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[{ label: '↺ −15°', delta: -15 }, { label: 'Reset', delta: 0 }, { label: '+15° ↻', delta: 15 }].map(({ label, delta }) => (
                    <button
                      key={label}
                      onClick={() => delta === 0 ? rotLogo(0, 'reset') : rotLogo(delta)}
                      style={{
                        flex: 1,
                        padding: '7px 0',
                        borderRadius: '7px',
                        cursor: 'pointer',
                        border: '1.5px solid rgba(255,255,255,0.07)',
                        background: 'rgba(255,255,255,0.02)',
                        color: '#94A3B8',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#1E3550', textAlign: 'center', marginTop: '6px' }}>
                  ✋ Arraste a logo no preview para mover
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div style={{ padding: '0 0 8px' }}>
          <a
            href={wppUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              width: '100%',
              padding: '14px 16px',
              background: 'linear-gradient(135deg,#22C55E,#15803D)',
              border: 'none',
              borderRadius: '11px',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 800,
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
              letterSpacing: '-0.2px',
              marginBottom: '8px',
              textDecoration: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            💬 Pedir pelo WhatsApp
          </a>
          <button
            onClick={copiarMsg}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '9px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: copied ? '#22C55E' : '#94A3B8',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all .2s',
            }}
          >
            {copied ? '✓ Copiado!' : '📋 Copiar resumo do pedido'}
          </button>
          <p style={{ fontSize: '0.65rem', color: '#1E3550', textAlign: 'center', marginTop: '10px', lineHeight: 1.6 }}>
            Um especialista ENTRATTA confirma os detalhes e envia o orçamento.
          </p>
        </div>
      </div>

      {/* ── PREVIEW ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px 20px',
          gap: '20px',
        }}
      >
        {/* Live badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(34,197,94,0.07)',
            border: '1px solid rgba(34,197,94,0.18)',
            borderRadius: '20px',
            padding: '5px 14px',
          }}
        >
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#22C55E',
              animation: 'pulse-dot 2s infinite',
            }}
          />
          <span style={{ fontSize: '0.68rem', color: '#22C55E', fontWeight: 700 }}>
            Preview ao vivo — atualiza enquanto você configura
          </span>
        </div>

        {/* SVG Carpet */}
        <svg
          ref={svgRef}
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={{
            borderRadius: '14px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
            display: 'block',
            maxWidth: '100%',
            transition: 'width .3s, height .3s',
          }}
        >
          <defs>
            <pattern id={patternId} x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M0,5 C2,2 6,8 9,5 C12,2 16,8 18,5" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M0,13 C3,10 7,16 10,13 C13,10 17,16 20,13" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M5,0 C2,4 7,7 5,11 C2,15 7,18 5,20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.1" strokeLinecap="round" />
              <ellipse cx="13" cy="8" rx="3.5" ry="2" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.9" transform="rotate(-25,13,8)" />
            </pattern>
            <pattern id={patternLightId} x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M0,5 C2,2 6,8 9,5 C12,2 16,8 18,5" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M0,13 C3,10 7,16 10,13 C13,10 17,16 20,13" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M5,0 C2,4 7,7 5,11" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1.1" strokeLinecap="round" />
            </pattern>
          </defs>

          {/* Carpet base */}
          <rect x={0} y={0} width={svgW} height={svgH} rx={12} fill={corTapeteObj.hex} />
          {/* Texture */}
          <rect x={0} y={0} width={svgW} height={svgH} rx={12} fill={`url(#${isLight ? patternLightId : patternId})`} />
          {/* Veil */}
          <rect x={0} y={0} width={svgW} height={svgH} rx={12} fill={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.15)'} />

          {/* Borders */}
          {s.borda === 'fina' && (
            <rect x={PAD / 2} y={PAD / 2} width={svgW - PAD} height={svgH - PAD} rx={8}
              fill="none" stroke={bordaHex} strokeWidth={4} opacity={0.8} />
          )}
          {s.borda === 'dupla' && (
            <>
              <rect x={PAD / 2} y={PAD / 2} width={svgW - PAD} height={svgH - PAD} rx={8}
                fill="none" stroke={bordaHex} strokeWidth={5} opacity={0.8} />
              <rect x={PAD} y={PAD} width={svgW - PAD * 2} height={svgH - PAD * 2} rx={5}
                fill="none" stroke={bordaHex} strokeWidth={2} opacity={0.45} />
            </>
          )}

          {/* Logo */}
          {s.logoSrc && logoDims && (
            <>
              <image
                href={s.logoSrc}
                x={logoDims.x}
                y={logoDims.y}
                width={logoDims.w}
                height={logoDims.h}
                preserveAspectRatio="xMidYMid meet"
                transform={
                  s.logoRotacao !== 0
                    ? `rotate(${s.logoRotacao},${logoDims.cx},${logoDims.cy})`
                    : undefined
                }
              />
              <rect
                data-drag="logo"
                x={logoDims.x - 6}
                y={logoDims.y - 6}
                width={logoDims.w + 12}
                height={logoDims.h + 12}
                fill="rgba(0,0,0,0)"
                rx={4}
                style={{ cursor: 'move', touchAction: 'none' }}
                pointerEvents="all"
              />
            </>
          )}

          {/* Snap guides */}
          {snapGuides.v && (
            <line x1={svgW / 2} y1={0} x2={svgW / 2} y2={svgH}
              stroke="#22C55E" strokeWidth={1.2} strokeDasharray="5,4" />
          )}
          {snapGuides.h && (
            <line x1={0} y1={svgH / 2} x2={svgW} y2={svgH / 2}
              stroke="#22C55E" strokeWidth={1.2} strokeDasharray="5,4" />
          )}
          {snapGuides.v && snapGuides.h && (
            <>
              <circle cx={svgW / 2} cy={svgH / 2} r={6} fill="none" stroke="#22C55E" strokeWidth={1.5} />
              <circle cx={svgW / 2} cy={svgH / 2} r={2} fill="#22C55E" />
            </>
          )}

          {/* Text */}
          {s.texto ? (
            <>
              <text
                x={textoDims?.x ?? svgW / 2}
                y={textoDims?.y ?? svgH / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={corTextoObj.hex}
                fontSize={textoDims?.fontSize ?? 14}
                fontFamily={fonteObj.f}
                fontWeight={fonteObj.w}
                letterSpacing={s.fonte === 'light' ? '4' : '2'}
              >
                {s.texto.toUpperCase()}
              </text>
              {textoDims && (
                <rect
                  data-drag="texto"
                  x={textoDims.x - textoDims.estW / 2}
                  y={textoDims.y - textoDims.estH / 2}
                  width={textoDims.estW}
                  height={textoDims.estH}
                  fill="rgba(0,0,0,0)"
                  rx={4}
                  style={{ cursor: 'move', touchAction: 'none' }}
                  pointerEvents="all"
                />
              )}
            </>
          ) : !s.logoSrc ? (
            <text
              x={svgW / 2}
              y={svgH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(255,255,255,0.15)"
              fontSize={13}
              fontFamily="Inter,sans-serif"
              fontWeight="500"
              letterSpacing="3"
            >
              SEU TEXTO AQUI
            </text>
          ) : null}

          {/* Dimension watermark */}
          <text
            x={svgW - 10}
            y={svgH - 10}
            textAnchor="end"
            fill="rgba(255,255,255,0.25)"
            fontSize={11}
            fontFamily="Inter,sans-serif"
            fontWeight="600"
            letterSpacing="0.5"
          >
            {medidaLabel}
          </text>
        </svg>

        {/* Info chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', width: '100%', maxWidth: '480px' }}>
          {[
            { label: 'Medida', val: medidaLabel },
            { label: 'Cor', val: corTapeteObj.label },
            { label: 'Texto', val: s.texto || '—' },
            { label: 'Preço', val: preco ? `R$ ${preco.toLocaleString('pt-BR')}` : '—', green: true },
          ].map(({ label, val, green }) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '8px 10px',
              }}
            >
              <div style={{ fontSize: '0.58rem', color: '#2E4A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                {label}
              </div>
              <div style={{ fontSize: '0.74rem', color: green ? '#22C55E' : '#E2E8F0', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {val}
              </div>
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['✓ Sem compromisso', '✓ Orçamento em minutos', '✓ Entrega todo o Brasil', '✓ Produção em 7 dias úteis'].map(g => (
            <span key={g} style={{ fontSize: '0.68rem', color: '#1E3A5C', fontWeight: 600 }}>{g}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
