'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { trackConfiguradorConfig, trackOrderCompleted } from '@/lib/analytics'
import { hashDesign } from '@/lib/services/design-hash'
import type { DesignPayload, VetorizacaoResultado } from '@/lib/types/producao'

import {
  CORES_PINTURA, CORES_TAPETE, LogoItem, MEDIDAS, TextoItem, makeId,
} from '../types'

export interface AdminConfig {
  diasUteis: number
  coresDisponiveis: string[]
  aviso: string
}

interface Params {
  lockedTamanho?: string
  lockedCor?: string
  pedidoInicial?: string
}

export const SNAP = 14

export function autoFontSize(texto: string, W: number): number {
  return Math.min(42, Math.max(12, Math.floor(W / (texto.length * 0.6 + 1))))
}

/** Geometria do logo no viewBox: centro, caixa e fator de escala px-local → viewBox. */
export function logoGeometry(
  lg: LogoItem, index: number, W: number, H: number, totalItens: number
) {
  const baseLW = Math.min(130, W * 0.32)
  const baseLH = Math.min(90, H * 0.38)
  const lw = baseLW * (lg.scale / 100)
  const lh = baseLH * (lg.scale / 100)
  const cx = lg.x ?? W / 2
  const cy = lg.y ?? ((index + 1) * H) / (totalItens + 1)
  const s = lg.vetor
    ? Math.min(lw / lg.vetor.largura_px, lh / lg.vetor.altura_px)
    : 1
  return { cx, cy, lw, lh, s }
}

export function useConfigurador({ lockedTamanho, lockedCor, pedidoInicial }: Params) {
  const [pedido, setPedido] = useState(pedidoInicial ?? '')
  const [nome, setNome] = useState('')
  const [wpp, setWpp] = useState('')
  const [medida, setMedida] = useState(lockedTamanho ?? '60x90')
  const [customL, setCustomL] = useState('')
  const [customC, setCustomC] = useState('')
  const [corTapete, setCorTapete] = useState(lockedCor ?? 'preto')
  const [borda, setBorda] = useState('sem')
  const [corBordaAci, setCorBordaAci] = useState(String(CORES_PINTURA[0].aci))
  const [textos, setTextos] = useState<TextoItem[]>([])
  const [logos, setLogos] = useState<LogoItem[]>([])
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({
    diasUteis: 7, coresDisponiveis: CORES_TAPETE.map(c => c.id), aviso: '',
  })

  // Prévia oficial de produção (gate de aprovação)
  const [previa, setPrevia] = useState<{ url: string; json: string; hash: string } | null>(null)
  const [gerandoPrevia, setGerandoPrevia] = useState(false)
  const [previaErro, setPreviaErro] = useState<string | null>(null)
  const [mostrarPrevia, setMostrarPrevia] = useState(false)

  const [aprovado, setAprovado] = useState(false)
  const [orderStep, setOrderStep] = useState<'idle' | 'building' | 'done'>('idle')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderErro, setOrderErro] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/config').then(r => r.json()).then(setAdminConfig).catch(() => {})
  }, [])

  // ── Dimensões do viewBox ──
  const m = MEDIDAS[medida]
  let larg = medida === 'custom' ? (parseFloat(customL) || 60) : (m.w! * 100)
  let comp = medida === 'custom' ? (parseFloat(customC) || 90) : (m.c! * 100)
  if (larg < comp) { const t = larg; larg = comp; comp = t }
  const W = 460
  const H = Math.round(W / (larg / comp))

  // ── Texto/Logo helpers ──
  function addTexto() {
    const suggestedSize = Math.min(32, Math.max(12, Math.floor(W / 10)))
    setTextos(prev => [...prev, {
      id: makeId(), texto: '', aci: CORES_PINTURA[0].aci, fonteId: 'bold',
      x: null, y: null, tamanho: suggestedSize,
    }])
  }
  function updateTexto(id: string, patch: Partial<TextoItem>) {
    setTextos(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
  }
  function removeTexto(id: string) {
    setTextos(prev => prev.filter(t => t.id !== id))
  }

  async function addLogo(file: File) {
    const id = makeId()
    const src = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = ev => resolve(ev.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    }).catch(() => null)
    if (!src) return
    setLogos(prev => [...prev, { id, src, x: null, y: null, scale: 100, rotacao: 0, vetor: null, vetorizando: true }])

    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/producao/vetorizar', { method: 'POST', body: form })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Falha na vetorização')
      }
      const resultado: VetorizacaoResultado = await res.json()
      const vetor = {
        largura_px: resultado.largura_px,
        altura_px: resultado.altura_px,
        // preserve original color swatches from the service so the UI can show them
        regioes: resultado.regioes.map(r => ({
          aci: r.aci_sugerido,
          aci_rgb: r.aci_sugerido_rgb ?? null,
          cor_original: r.cor_original ?? null,
          cor_original_rgb: r.cor_original_rgb ?? null,
          poligonos: r.poligonos,
        })),
      }
      setLogos(prev => prev.map(l => l.id === id ? { ...l, vetor, vetorizando: false } : l))
    } catch (e) {
      setLogos(prev => prev.filter(l => l.id !== id))
      setPreviaErro(e instanceof Error ? e.message : 'Não foi possível vetorizar o logo')
    }
  }
  function updateLogo(id: string, patch: Partial<LogoItem>) {
    setLogos(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))
  }
  function removeLogo(id: string) {
    setLogos(prev => prev.filter(l => l.id !== id))
  }
  function setRegiaoAci(logoId: string, regiaoIndex: number, aci: number) {
    setLogos(prev => prev.map(l => {
      if (l.id !== logoId || !l.vetor) return l
      const regioes = l.vetor.regioes.map((r, i) => i === regiaoIndex ? { ...r, aci } : r)
      return { ...l, vetor: { ...l.vetor, regioes } }
    }))
  }

  // ── Payload de produção (contrato do serviço) ──
  const montarPayload = useCallback((): DesignPayload => {
    const totalItens = logos.length + textos.length
    return {
      pedido_id: 'SEM-ID',
      tamanho_mm: { largura: larg * 10, altura: comp * 10 },
      viewbox_px: { w: W, h: H },
      fundo: { cor_id: corTapete },
      borda: {
        estilo: (borda as 'sem' | 'fina' | 'dupla') ?? 'sem',
        aci: Number(corBordaAci),
      },
      textos: textos.filter(t => t.texto).map((t, i) => ({
        texto: t.texto.toUpperCase(),
        fonte_id: t.fonteId,
        aci: t.aci,
        x: t.x ?? W / 2,
        y: t.y ?? ((logos.length + i + 1) * H) / (totalItens + 1),
        tamanho_px: t.tamanho || autoFontSize(t.texto, W),
      })),
      logos: logos.filter(l => l.vetor).map((l, i) => {
        const geo = logoGeometry(l, i, W, H, totalItens)
        return {
          x: geo.cx,
          y: geo.cy,
          scale: geo.s,
          rotacao: l.rotacao,
          largura_px: l.vetor!.largura_px,
          altura_px: l.vetor!.altura_px,
          regioes: l.vetor!.regioes.map(r => ({ aci: r.aci, poligonos: r.poligonos })),
        }
      }),
    }
  }, [textos, logos, borda, corBordaAci, corTapete, larg, comp, W, H])

  const payloadJson = useMemo(() => JSON.stringify(montarPayload()), [montarPayload])
  const previaValida = previa !== null && previa.json === payloadJson
  const temConteudo = textos.some(t => t.texto) || logos.some(l => l.vetor) || borda !== 'sem'
  const logosPendentes = logos.some(l => l.vetorizando)

  async function gerarPrevia() {
    if (gerandoPrevia || !temConteudo || logosPendentes) return
    setGerandoPrevia(true)
    setPreviaErro(null)
    try {
      const design = montarPayload()
      const json = JSON.stringify(design)
      const res = await fetch('/api/producao/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Falha ao gerar prévia')
      }
      const blob = await res.blob()
      const hash = await hashDesign(design)
      setPrevia(prev => {
        if (prev) URL.revokeObjectURL(prev.url)
        return { url: URL.createObjectURL(blob), json, hash }
      })
      setMostrarPrevia(true)
    } catch (e) {
      setPreviaErro(e instanceof Error ? e.message : 'Erro ao gerar prévia')
    } finally {
      setGerandoPrevia(false)
    }
  }

  async function criarPedido() {
    if (!aprovado || !previaValida || !previa || orderStep === 'building') return
    setOrderStep('building')
    setOrderErro(null)
    try {
      const design = JSON.parse(previa.json)
      const res = await fetch('/api/orders/criar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: { nome: nome || 'Cliente', whatsapp: wpp },
          quantidade: 1,
          design,
          previewHash: previa.hash,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Erro ao criar pedido')
      setOrderId(data.orderId)
      setOrderStep('done')
      trackOrderCompleted(data.orderId, MEDIDAS[medida]?.l ?? medida)
      trackConfiguradorConfig(MEDIDAS[medida]?.l ?? medida, corTapete)
    } catch (e) {
      setOrderErro(e instanceof Error ? e.message : 'Erro ao criar pedido')
      setOrderStep('idle')
    }
  }

  // ── Drag ──
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef({ active: false, target: '', itemId: '', svgX0: 0, svgY0: 0, startX: 0, startY: 0 })
  const [showGuides, setShowGuides] = useState({ v: false, h: false })

  const getSVGPt = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const r = svg.getBoundingClientRect()
    const cx = 'touches' in e ? (e as TouchEvent).touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX
    const cy = 'touches' in e ? (e as TouchEvent).touches[0]?.clientY ?? 0 : (e as MouseEvent).clientY
    return { x: (cx - r.left) / r.width * W, y: (cy - r.top) / r.height * H }
  }, [W, H])

  function startDrag(e: React.MouseEvent | React.TouchEvent, target: 'logo' | 'texto', itemId: string, curX: number, curY: number) {
    e.preventDefault()
    const pt = getSVGPt(e)
    Object.assign(dragRef.current, { active: true, target, itemId, svgX0: pt.x, svgY0: pt.y, startX: curX, startY: curY })
  }

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    const d = dragRef.current
    if (!d.active) return
    e.preventDefault()
    const pt = getSVGPt(e)
    let nx = d.startX + (pt.x - d.svgX0)
    let ny = d.startY + (pt.y - d.svgY0)
    nx = Math.max(20, Math.min(W - 20, nx))
    ny = Math.max(20, Math.min(H - 20, ny))
    if (Math.abs(nx - W / 2) < SNAP) nx = W / 2
    if (Math.abs(ny - H / 2) < SNAP) ny = H / 2
    setShowGuides({ v: Math.abs(nx - W / 2) < 1, h: Math.abs(ny - H / 2) < 1 })
    if (d.target === 'logo') updateLogo(d.itemId, { x: nx, y: ny })
    else updateTexto(d.itemId, { x: nx, y: ny })
  }, [getSVGPt, W, H])

  const handleDragEnd = useCallback(() => {
    dragRef.current.active = false
    setShowGuides({ v: false, h: false })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('touchmove', handleDragMove, { passive: false })
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('touchend', handleDragEnd)
    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [handleDragMove, handleDragEnd])

  return {
    // dados
    pedido, setPedido, nome, setNome, wpp, setWpp,
    medida, setMedida, customL, setCustomL, customC, setCustomC,
    corTapete, setCorTapete, borda, setBorda, corBordaAci, setCorBordaAci,
    textos, addTexto, updateTexto, removeTexto,
    logos, addLogo, updateLogo, removeLogo, setRegiaoAci,
    adminConfig,
    // geometria
    W, H, larg, comp, svgRef, startDrag, showGuides,
    // prévia + pedido
    previa, previaValida, gerandoPrevia, previaErro, setPreviaErro,
    mostrarPrevia, setMostrarPrevia, gerarPrevia,
    temConteudo, logosPendentes,
    aprovado, setAprovado, orderStep, orderId, orderErro, criarPedido,
  }
}
