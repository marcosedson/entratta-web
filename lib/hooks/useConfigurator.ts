import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import {
  CARPET_COLORS,
  TEXT_COLORS,
  BORDER_COLORS,
  MEASUREMENTS,
  BORDERS,
  FONTS,
  CONFIGURATOR_SNAP,
  WPP_PHONE,
} from '@/lib/constants'

export interface ConfiguratorState {
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

const DEFAULT_STATE: ConfiguratorState = {
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

export function useConfigurator() {
  const [state, setState] = useState<ConfiguratorState>(DEFAULT_STATE)
  const [svgW, setSvgW] = useState(460)
  const [snapGuides, setSnapGuides] = useState({ v: false, h: false })
  const [copied, setCopied] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef({
    active: false,
    target: '',
    svgX0: 0,
    svgY0: 0,
    startX: 0,
    startY: 0,
  })
  const svgDimsRef = useRef({ w: svgW, h: 0 })
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const update = () => {
      const w = Math.min(460, window.innerWidth - 60)
      setSvgW(w)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { svgH, medidaLabel } = useMemo(() => {
    let l: number, c: number
    if (state.medida === 'custom') {
      l = parseFloat(state.customL) || 60
      c = parseFloat(state.customC) || 90
    } else {
      const m = MEASUREMENTS[state.medida]
      l = m.w * 100
      c = m.c * 100
    }
    let dL = l,
      dC = c
    if (dL < dC) {
      const t = dL
      dL = dC
      dC = t
    }
    const H = Math.round(svgW / (dL / dC))
    const label =
      state.medida === 'custom'
        ? `${state.customL || '?'}×${state.customC || '?'} cm`
        : MEASUREMENTS[state.medida].l
    return { svgH: H, medidaLabel: label }
  }, [state.medida, state.customL, state.customC, svgW])

  useEffect(() => {
    svgDimsRef.current = { w: svgW, h: svgH }
  }, [svgW, svgH])

  const preco = useMemo(() => {
    if (state.medida === 'custom') {
      const l = parseFloat(state.customL) || 0
      const c = parseFloat(state.customC) || 0
      return l > 0 && c > 0 ? Math.round((l / 100) * (c / 100) * 300) : null
    }
    const m = MEASUREMENTS[state.medida]
    return Math.round(m.w * m.c * 300)
  }, [state.medida, state.customL, state.customC])

  const corTapeteObj = CARPET_COLORS.find((c) => c.id === state.corTapete)!
  const corTextoObj = TEXT_COLORS.find((c) => c.id === state.corTexto)!
  const fonteObj = FONTS.find((f) => f.id === state.fonte)!
  const isLight = ['bege', 'cinza'].includes(state.corTapete)
  const fonteData = { f: fonteObj.f, w: fonteObj.w }
  const bordaHex = BORDER_COLORS.find((c) => c.id === state.corBorda)?.hex ?? '#FFFFFF'

  const logoDims = useMemo(() => {
    if (!state.logoSrc) return null
    const baseLW = Math.min(130, svgW * 0.32)
    const baseLH = Math.min(90, svgH * 0.38)
    const lw = baseLW * state.logoScale
    const lh = baseLH * state.logoScale
    const cx = state.logoX !== null ? state.logoX : svgW / 2
    const cy =
      state.logoY !== null
        ? state.logoY
        : state.texto
        ? svgH / 2 - lh / 2 - 10
        : svgH / 2
    return { x: cx - lw / 2, y: cy - lh / 2, w: lw, h: lh, cx, cy }
  }, [state.logoSrc, state.logoX, state.logoY, state.logoScale, svgW, svgH, state.texto])

  const textoDims = useMemo(() => {
    if (!state.texto) return null
    const maxFont = Math.min(
      42,
      Math.max(12, Math.floor(svgW / (state.texto.length * 0.6 + 1)))
    )
    const tx = state.textoX !== null ? state.textoX : svgW / 2
    const ty =
      state.textoY !== null
        ? state.textoY
        : state.logoSrc
        ? svgH * 0.76
        : svgH / 2
    const estW = Math.min(svgW - 20, maxFont * state.texto.length * 0.62 + 16)
    const estH = maxFont * 1.5
    return { x: tx, y: ty, fontSize: maxFont, estW, estH }
  }, [state.texto, state.textoX, state.textoY, svgW, svgH, state.logoSrc])

  const wppUrl = useMemo(() => {
    const corBordaLabel =
      BORDER_COLORS.find((c) => c.id === state.corBorda)?.label ?? state.corBorda
    const bordaObj = BORDERS.find((b) => b.id === state.borda)!
    const msg = `Olá! Quero montar meu capacho personalizado 🚪\n\n👤 Nome: ${state.nome || 'não informado'}\n📐 Medida: ${medidaLabel}\n🎨 Cor do tapete: ${corTapeteObj.label}\n✏️ Texto: ${state.texto || 'sem texto'}\n🖊️ Cor do texto: ${corTextoObj.label}\n🔲 Borda: ${bordaObj.l}${state.borda !== 'sem' ? ` — Cor: ${corBordaLabel}` : ''}\n🖼️ Logo: ${state.logoSrc ? 'SIM — envio no próximo passo' : 'não'}\n💰 Preço estimado: ${preco ? `R$ ${preco.toLocaleString('pt-BR')}` : 'a calcular'}\n\nAguardo o orçamento! 😊`
    return `https://wa.me/${WPP_PHONE}?text=${encodeURIComponent(msg)}`
  }, [state, medidaLabel, corTapeteObj, corTextoObj, preco])

  const getSVGPt = useCallback((e: MouseEvent | TouchEvent) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const r = svg.getBoundingClientRect()
    const { w, h } = svgDimsRef.current
    const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
    const cy = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY
    return {
      x: ((cx - r.left) / r.width) * w,
      y: ((cy - r.top) / r.height) * h,
    }
  }, [])

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
        startX: tgt === 'logo' ? cur.logoX ?? w / 2 : cur.textoX ?? w / 2,
        startY: tgt === 'logo' ? cur.logoY ?? h / 2 : cur.textoY ?? h / 2,
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
      const snapX = Math.abs(nx - w / 2) < CONFIGURATOR_SNAP
      const snapY = Math.abs(ny - h / 2) < CONFIGURATOR_SNAP
      if (snapX) nx = w / 2
      if (snapY) ny = h / 2
      setSnapGuides({ v: snapX, h: snapY })
      if (dragRef.current.target === 'logo') {
        setState((prev) => ({ ...prev, logoX: nx, logoY: ny }))
      } else {
        setState((prev) => ({ ...prev, textoX: nx, textoY: ny }))
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

  const set = useCallback((patch: Partial<ConfiguratorState>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }, [])

  const loadLogo = (file: File) => {
    const r = new FileReader()
    r.onload = (e) => {
      set({
        logoSrc: e.target?.result as string,
        logoX: null,
        logoY: null,
      })
    }
    r.readAsDataURL(file)
  }

  const removeLogo = () =>
    set({ logoSrc: null, logoX: null, logoY: null, logoScale: 1, logoRotacao: 0 })

  const rotLogo = (delta: number, modo?: 'reset') => {
    if (modo === 'reset') {
      set({ logoRotacao: 0 })
      return
    }
    set({ logoRotacao: ((state.logoRotacao + delta) % 360 + 360) % 360 })
  }

  const copiarMsg = async () => {
    const bordaObj = BORDERS.find((b) => b.id === state.borda)!
    const msg = `ENTRATTA Capachos — Pedido\nMedida: ${medidaLabel}\nCor: ${corTapeteObj.label}\nTexto: ${state.texto || '—'}\nLogo: ${state.logoSrc ? 'Sim' : 'Não'}\nPreço estimado: ${preco ? 'R$' + preco : 'a calcular'}\nBorda: ${bordaObj.l}\nWhatsApp: (64) 99206-6855`
    try {
      await navigator.clipboard.writeText(msg)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {}
  }

  return {
    state,
    set,
    svgW,
    setSvgW,
    svgH,
    medidaLabel,
    preco,
    corTapeteObj,
    corTextoObj,
    fonteObj: { f: fonteObj.f, w: fonteObj.w, id: fonteObj.id, l: fonteObj.l },
    isLight,
    bordaHex,
    logoDims,
    textoDims,
    wppUrl,
    snapGuides,
    svgRef,
    loadLogo,
    removeLogo,
    rotLogo,
    copiarMsg,
    copied,
    setCopied,
  }
}
