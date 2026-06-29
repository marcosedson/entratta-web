'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  TextoItem, LogoItem,
  CORES_TAPETE, CORES_TEXTO, CORES_BORDA, MEDIDAS, BORDAS, FONTES,
  calcPreco, makeId,
} from './types'

// ── Styles ──
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.08)', borderRadius: 8,
  padding: '9px 11px', color: '#E2E8F0', fontSize: '.82rem',
  fontFamily: "'Inter', sans-serif", outline: 'none',
}
const secStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
  borderRadius: 11, padding: '13px 14px', marginBottom: 10,
}
const secTitleStyle: React.CSSProperties = {
  fontSize: '.58rem', fontWeight: 700, letterSpacing: 1.5,
  textTransform: 'uppercase', color: '#22C55E', marginBottom: 11,
  display: 'flex', alignItems: 'center', gap: 5,
}
const chipBtnBase: React.CSSProperties = {
  padding: '5px 10px', borderRadius: 6, cursor: 'pointer', outline: 'none',
  fontSize: '.7rem', fontWeight: 600, transition: 'all .15s',
}
const rotBtnStyle: React.CSSProperties = {
  flex: 1, padding: '7px 0', borderRadius: 7, cursor: 'pointer',
  border: '1.5px solid rgba(255,255,255,.07)', background: 'rgba(255,255,255,.02)',
  color: '#94A3B8', fontSize: '.8rem', fontWeight: 700,
}

function adjustHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount))
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount))
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

function Section({ title, locked, children }: { title: string; locked?: boolean; children: React.ReactNode }) {
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

function CoresRow({ cores, ativo, onSelect, locked }: { cores: Array<{ id: string; label: string; hex: string }>; ativo: string; onSelect: (id: string) => void; locked?: boolean }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, alignItems: 'center', pointerEvents: locked ? 'none' : undefined }}>
      {cores.map(c => (
        <div key={c.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div onClick={() => onSelect(c.id)} style={{
            width: 30, height: 30, borderRadius: '50%', cursor: locked ? 'default' : 'pointer', background: c.hex,
            border: ativo === c.id ? '3px solid #22C55E' : (c.id === 'branco' ? '2px solid #555' : '2px solid rgba(255,255,255,.1)'),
            transform: ativo === c.id ? 'scale(1.18)' : 'none',
            boxShadow: ativo === c.id ? '0 0 0 2px rgba(34,197,94,.25)' : 'none',
          }} />
          <div style={{ fontSize: '.58rem', color: '#2E4A6A', textAlign: 'center', maxWidth: 36, lineHeight: 1.2 }}>{c.label}</div>
        </div>
      ))}
    </div>
  )
}

interface AdminConfig {
  diasUteis: number
  coresDisponiveis: string[]
  aviso: string
}

interface Props {
  lockedTamanho?: string
  lockedCor?: string
  pedidoInicial?: string
  canal?: 'ml' | 'shopee'
}

interface ArtefatosResult {
  pedidoId: number
  pastaLocalizada: string
  cores: Array<{ numero: number; nome: string; hex: string; arquivo_tap: string }>
  resumo: { instrucoes: string[]; tempo_total_minutos: number }
}

export default function Configurador({ lockedTamanho, lockedCor, pedidoInicial, canal }: Props) {
  const [pedido, setPedido] = useState(pedidoInicial ?? '')
  const [nome, setNome] = useState('')
  const [wpp, setWpp] = useState('')
  const [medida, setMedida] = useState(lockedTamanho ?? '60x90')
  const [customL, setCustomL] = useState('')
  const [customC, setCustomC] = useState('')
  const [corTapete, setCorTapete] = useState(lockedCor ?? 'preto')
  const [borda, setBorda] = useState('sem')
  const [corBorda, setCorBorda] = useState('branco')
  const [textos, setTextos] = useState<TextoItem[]>([])
  const [logos, setLogos] = useState<LogoItem[]>([])
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({
    diasUteis: 7, coresDisponiveis: CORES_TAPETE.map(c => c.id), aviso: '',
  })
  const [gerandoArtefatos, setGerandoArtefatos] = useState(false)
  const [artefatosResult, setArtefatosResult] = useState<ArtefatosResult | null>(null)
  const [finalizando, setFinalizando] = useState(false)
  const [pastaFinal, setPastaFinal] = useState<string | null>(null)
  const [aprovado, setAprovado] = useState(false)
  const [orderStep, setOrderStep] = useState<'idle' | 'building' | 'done_share' | 'done_download'>('idle')

  useEffect(() => {
    fetch('/api/admin/config').then(r => r.json()).then(setAdminConfig).catch(() => {})
  }, [])

  const svgRef = useRef<SVGSVGElement>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Drag
  const dragRef = useRef<{ active: boolean; target: string; itemId: string; svgX0: number; svgY0: number; startX: number; startY: number }>({
    active: false, target: '', itemId: '', svgX0: 0, svgY0: 0, startX: 0, startY: 0,
  })
  const [showGuides, setShowGuides] = useState({ v: false, h: false })

  const coresTapeteDisponiveis = CORES_TAPETE.filter(c => adminConfig.coresDisponiveis.includes(c.id))
  const corTapeteObj = CORES_TAPETE.find(c => c.id === corTapete) ?? CORES_TAPETE[0]

  const m = MEDIDAS[medida]
  let larg = medida === 'custom' ? (parseFloat(customL) || 60) : (m.w! * 100)
  let comp = medida === 'custom' ? (parseFloat(customC) || 90) : (m.c! * 100)
  if (larg < comp) { const t = larg; larg = comp; comp = t }
  const ratio = larg / comp
  const W = 460
  const H = Math.round(W / ratio)
  const PAD = 18
  const SNAP = 14

  const preco = calcPreco(medida, customL, customC)
  const precoFmt = preco ? `R$ ${preco.toLocaleString('pt-BR')}` : '—'
  const medidaLabel = medida === 'custom' ? `${customL || '?'}×${customC || '?'} cm` : MEDIDAS[medida].l
  const bordaHex = CORES_BORDA.find(c => c.id === corBorda)?.hex || '#FFFFFF'

  // ── Texto helpers ──
  function addTexto() {
    // Sugere tamanho baseado na largura disponível
    const suggestedSize = Math.min(32, Math.max(12, Math.floor(W / 10)))
    setTextos(prev => [...prev, { id: makeId(), texto: '', corId: 'branco', fonteId: 'bold', x: null, y: null, tamanho: suggestedSize }])
  }
  function updateTexto(id: string, patch: Partial<TextoItem>) {
    setTextos(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
  }
  function removeTexto(id: string) {
    setTextos(prev => prev.filter(t => t.id !== id))
  }

  // ── Logo helpers ──
  function addLogo(file: File) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      const id = makeId()
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const scale = Math.max(1, 400 / Math.max(img.width, img.height))
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')!
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        setLogos(prev => [...prev, { id, src: canvas.toDataURL('image/png'), x: null, y: null, scale: 100, rotacao: 0, removingBg: false }])
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }
  function updateLogo(id: string, patch: Partial<LogoItem>) {
    setLogos(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))
  }
  function removeLogo(id: string) {
    setLogos(prev => prev.filter(l => l.id !== id))
  }

  // ── Drag ──
  function getSVGPt(e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const r = svg.getBoundingClientRect()
    const cx = 'touches' in e ? (e as TouchEvent).touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX
    const cy = 'touches' in e ? (e as TouchEvent).touches[0]?.clientY ?? 0 : (e as MouseEvent).clientY
    return { x: (cx - r.left) / r.width * W, y: (cy - r.top) / r.height * H }
  }

  function startDrag(e: React.MouseEvent | React.TouchEvent, target: string, itemId: string, curX: number, curY: number) {
    e.preventDefault()
    const pt = getSVGPt(e as any)
    const d = dragRef.current
    d.active = true; d.target = target; d.itemId = itemId
    d.svgX0 = pt.x; d.svgY0 = pt.y
    d.startX = curX; d.startY = curY
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, H])

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

  // ── WhatsApp message ──
  function buildMsg() {
    const corObj = CORES_TAPETE.find(c => c.id === corTapete)!
    const bordaObj = BORDAS.find(b => b.id === borda)!
    const bordaCorLabel = CORES_BORDA.find(c => c.id === corBorda)?.label || corBorda
    const textosDesc = textos.filter(t => t.texto).map(t => {
      const cor = CORES_TEXTO.find(c => c.id === t.corId)?.label || t.corId
      const fnt = FONTES.find(f => f.id === t.fonteId)?.l || t.fonteId
      const tam = t.tamanho === 0 ? 'auto' : t.tamanho + 'px'
      return `"${t.texto}" (${fnt}, ${cor}, tam: ${tam})`
    }).join(', ') || 'sem texto'

    const canalHeader = canal === 'ml' ? '*MERCADO LIVRE*\n' : canal === 'shopee' ? '*SHOPEE*\n' : ''
    const pedidoLine = pedido ? `Pedido: *#${pedido}*\n` : ''

    return `${canalHeader}${pedidoLine}Olá! Segue meu pedido de capacho personalizado — preview e PDF em anexo.

Nome: ${nome || 'não informado'}
Medida: ${medidaLabel}${lockedTamanho ? ' (via marketplace)' : ''}
Cor: ${corObj.label}${lockedCor ? ' (via marketplace)' : ''}
Textos: ${textosDesc}
Borda: ${bordaObj.l}${borda !== 'sem' ? ' — ' + bordaCorLabel : ''}
Logos: ${logos.length > 0 ? logos.length + ' logo(s)' : 'não'}
Valor estimado: ${precoFmt}
Prazo: ${adminConfig.diasUteis} dias úteis

Arte aprovada digitalmente — aguardo confirmação para produção.`.trim()
  }

  const wppLink = `https://wa.me/5564992066855?text=${encodeURIComponent(buildMsg())}`

  // ── Finalizar: salva PDF + TAP na pasta do servidor e abre WhatsApp ──
  async function finalizarPedido() {
    setFinalizando(true)
    setPastaFinal(null)
    try {
      // Gera PDF como base64 (sem baixar ainda)
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const W = 210
      doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 297, 'F')
      doc.setFillColor(10, 22, 40); doc.rect(0, 0, W, 30, 'F')
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(20)
      doc.text('ENTRATTA', 15, 17)
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184)
      doc.text('CAPACHOS E TAPETES PERSONALIZADOS', 15, 25)
      let y = 40
      if (canal || pedido) {
        doc.setFillColor(240, 253, 244); doc.setDrawColor(34, 197, 94); doc.setLineWidth(0.4)
        doc.roundedRect(15, y - 5, W - 30, 14, 3, 3, 'FD')
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(21, 128, 61)
        const cl = canal === 'ml' ? 'MERCADO LIVRE' : canal === 'shopee' ? 'SHOPEE' : ''
        doc.text(`${cl ? cl + (pedido ? ' · ' : '') : ''}${pedido ? 'Pedido #' + pedido : ''}`, 20, y + 3)
        y += 20
      }
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(148, 163, 184)
      doc.text(`${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 15, y); y += 10
      doc.setDrawColor(34, 197, 94); doc.setLineWidth(0.4); doc.line(15, y, W - 15, y); y += 8
      const sec = (t: string) => { doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(30, 58, 95); doc.text(t, 15, y); doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.2); doc.line(15, y + 2, W - 15, y + 2); y += 8 }
      const row = (l: string, v: string) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.text(l + ':', 15, y); doc.setTextColor(30, 41, 59); doc.text(v, 55, y); y += 6 }
      sec('CLIENTE'); row('Nome', nome || 'Não informado'); if (wpp) row('WhatsApp', wpp); y += 4
      sec('PRODUTO')
      row('Medida', medidaLabel + (lockedTamanho ? ' (marketplace)' : ''))
      row('Cor', corTapeteObj.label + (lockedCor ? ' (marketplace)' : ''))
      row('Prazo', `${adminConfig.diasUteis} dias úteis`); y += 4
      const tv = textos.filter(t => t.texto)
      if (tv.length > 0) {
        sec(`TEXTOS (${tv.length})`)
        tv.forEach((t, i) => {
          const cor = CORES_TEXTO.find(c => c.id === t.corId)?.label || t.corId
          doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(30, 41, 59)
          doc.text(`${i + 1}. "${t.texto.toUpperCase()}"`, 15, y); y += 5
          doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(100, 116, 139)
          doc.text(`   Cor: ${cor}`, 15, y); y += 6
        })
      }
      if (logos.length > 0) { sec(`LOGOS (${logos.length})`); doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.text(`${logos.length} imagem(ns) incluída(s)`, 15, y); y += 10 }
      y = 282; doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3); doc.line(15, y, W - 15, y); y += 5
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(150, 150, 150)
      doc.text('ENTRATTA · entratta.com.br · (64) 99206-6855', 15, y)
      const pdfBase64 = doc.output('datauristring')

      // Envia para o servidor salvar
      const res = await fetch('/api/orders/finalizar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido: pedido || undefined,
          canal: canal || 'direto',
          medida,
          corTapete,
          border: { type: borda === 'sem' ? 'none' : borda === 'fina' ? 'thin' : 'double', color: corBorda },
          textos: textos.filter(t => t.texto),
          logos,
          pdfBase64,
        }),
      })
      const data = await res.json()
      if (data.ok) setPastaFinal(data.pasta)
    } catch (e) {
      console.error('[finalizar]', e)
    } finally {
      setFinalizando(false)
    }
    // Abre WhatsApp
    window.open(wppLink, '_blank')
  }

  // ── Preview: captura SVG como JPEG data URL ──
  async function captureSVGPreview(): Promise<string | null> {
    try {
      const svgEl = svgRef.current
      if (!svgEl) return null
      const clone = svgEl.cloneNode(true) as SVGSVGElement
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      clone.setAttribute('width', String(W))
      clone.setAttribute('height', String(H))
      const svgStr = new XMLSerializer().serializeToString(clone)
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      return new Promise<string | null>((resolve) => {
        const img = new Image()
        img.onload = () => {
          try {
            const scale = 2
            const c = document.createElement('canvas')
            c.width = W * scale; c.height = H * scale
            const ctx = c.getContext('2d')!
            ctx.scale(scale, scale)
            ctx.fillStyle = '#0A1628'
            ctx.fillRect(0, 0, W, H)
            ctx.drawImage(img, 0, 0, W, H)
            URL.revokeObjectURL(url)
            resolve(c.toDataURL('image/jpeg', 0.92))
          } catch { URL.revokeObjectURL(url); resolve(null) }
        }
        img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
        img.src = url
      })
    } catch { return null }
  }

  // ── PDF de pedido (com preview + aprovação digital) ──
  async function buildOrderPDF(previewDataUrl: string | null): Promise<ArrayBuffer> {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const PW = 210
    const now = new Date()

    doc.setFillColor(255, 255, 255); doc.rect(0, 0, PW, 297, 'F')
    // Header
    doc.setFillColor(10, 22, 40); doc.rect(0, 0, PW, 30, 'F')
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(20)
    doc.text('ENTRATTA', 15, 17)
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184)
    doc.text('CAPACHOS E TAPETES PERSONALIZADOS', 15, 25)
    doc.setTextColor(34, 197, 94); doc.setFont('helvetica', 'bold'); doc.setFontSize(7)
    doc.text('COMPROVANTE DE PEDIDO', PW - 15, 17, { align: 'right' })

    let y = 38

    // Canal + pedido
    if (canal || pedido) {
      doc.setFillColor(240, 253, 244); doc.setDrawColor(34, 197, 94); doc.setLineWidth(0.4)
      doc.roundedRect(15, y - 4, PW - 30, 12, 3, 3, 'FD')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(21, 128, 61)
      const cl = canal === 'ml' ? 'MERCADO LIVRE' : canal === 'shopee' ? 'SHOPEE' : ''
      doc.text(`${cl ? cl + (pedido ? ' · ' : '') : ''}${pedido ? 'Pedido #' + pedido : ''}`, 20, y + 3)
      y += 16
    }

    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(148, 163, 184)
    doc.text(`Gerado em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`, 15, y); y += 8
    doc.setDrawColor(34, 197, 94); doc.setLineWidth(0.4); doc.line(15, y, PW - 15, y); y += 6

    // Preview image
    if (previewDataUrl) {
      const imgW = 140
      const imgH = Math.round(imgW * H / W)
      const imgX = (PW - imgW) / 2
      doc.addImage(previewDataUrl, 'JPEG', imgX, y, imgW, imgH)
      doc.setDrawColor(34, 197, 94); doc.setLineWidth(0.3)
      doc.rect(imgX, y, imgW, imgH)
      y += imgH + 4
      doc.setFont('helvetica', 'italic'); doc.setFontSize(7); doc.setTextColor(100, 116, 139)
      doc.text('Preview da arte — para referência visual. Arte final pode variar levemente.', PW / 2, y, { align: 'center' })
      y += 8
    }

    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.2); doc.line(15, y, PW - 15, y); y += 6

    const sec = (t: string) => {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(30, 58, 95)
      doc.text(t, 15, y); doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.2); doc.line(15, y + 2, PW - 15, y + 2); y += 8
    }
    const row = (l: string, v: string) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(100, 116, 139)
      doc.text(l + ':', 15, y); doc.setTextColor(30, 41, 59); doc.text(v, 58, y); y += 6
    }

    sec('CLIENTE')
    row('Nome', nome || 'Não informado')
    if (wpp) row('WhatsApp', wpp)
    y += 3

    sec('PRODUTO')
    row('Medida', medidaLabel + (lockedTamanho ? ' (via marketplace)' : ''))
    row('Cor do tapete', corTapeteObj.label + (lockedCor ? ' (via marketplace)' : ''))
    row('Borda', BORDAS.find(b => b.id === borda)?.l || borda)
    if (borda !== 'sem') row('Cor da borda', CORES_BORDA.find(c => c.id === corBorda)?.label || corBorda)
    row('Valor estimado', precoFmt)
    row('Prazo de produção', `${adminConfig.diasUteis} dias úteis`)
    y += 3

    const tv = textos.filter(t => t.texto)
    if (tv.length > 0) {
      sec(`TEXTOS PERSONALIZADOS (${tv.length})`)
      tv.forEach((t, i) => {
        const cor = CORES_TEXTO.find(c => c.id === t.corId)?.label || t.corId
        const fnt = FONTES.find(f => f.id === t.fonteId)?.l || t.fonteId
        const tam = t.tamanho === 0 ? 'Auto' : t.tamanho + 'px'
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(30, 41, 59)
        doc.text(`${i + 1}. "${t.texto.toUpperCase()}"`, 15, y); y += 5
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(100, 116, 139)
        doc.text(`   Fonte: ${fnt} · Cor: ${cor} · Tamanho: ${tam}`, 15, y); y += 6
      })
      y += 2
    }
    if (logos.length > 0) {
      sec(`LOGOS (${logos.length})`)
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(100, 116, 139)
      doc.text(`${logos.length} arquivo(s) de imagem incluído(s)`, 15, y); y += 10
    }

    // Aprovação digital
    const aprovY = Math.max(y + 6, 240)
    doc.setFillColor(240, 253, 244); doc.setDrawColor(34, 197, 94); doc.setLineWidth(0.4)
    doc.roundedRect(15, aprovY - 4, PW - 30, 34, 3, 3, 'FD')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(21, 128, 61)
    doc.text('APROVACAO DIGITAL DA ARTE', 20, aprovY + 3)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(30, 58, 95)
    doc.text(`Cliente: ${nome || 'Não identificado'}`, 20, aprovY + 10)
    doc.text(`Aprovado em: ${now.toLocaleDateString('pt-BR')} as ${now.toLocaleTimeString('pt-BR')}`, 20, aprovY + 17)
    doc.setTextColor(100, 116, 139); doc.setFontSize(7.5)
    doc.text('O cliente declarou que revisou e aprovou esta arte para producao.', 20, aprovY + 23)
    doc.text('Este documento serve como comprovante de aprovacao do pedido.', 20, aprovY + 28)

    // Footer
    const footY = 287
    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3); doc.line(15, footY, PW - 15, footY)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(150, 150, 150)
    doc.text('ENTRATTA · entratta.com.br · WhatsApp: (64) 99206-6855', 15, footY + 5)

    return doc.output('arraybuffer')
  }

  // ── Criar Pedido: processa logo + envia para servidor ──
  async function criarPedido() {
    if (!aprovado || orderStep === 'building') return
    setOrderStep('building')
    try {
      console.log(`\n🚀 INICIANDO CRIAÇÃO DE PEDIDO`)
      console.log(`📋 Dados:`)
      console.log(`   Nome: ${nome || 'N/A'}`)
      console.log(`   WhatsApp: ${wpp || 'N/A'}`)
      console.log(`   Medida: ${medidaLabel}`)
      console.log(`   Logos: ${logos.length}`)

      const previewDataUrl = await captureSVGPreview()
      console.log(`\n📸 CANVAS PREVIEW CAPTURADO:`)
      console.log(`   Tamanho: ${previewDataUrl ? (previewDataUrl.length / 1024).toFixed(2) : 0} KB`)
      console.log(`   Status: ${previewDataUrl ? '✅ SUCESSO' : '❌ FALHOU'}`)
      if (!previewDataUrl) {
        console.warn(`⚠️ AVISO: Preview não foi capturado! PDF pode ficar vazio`)
      }

      // Processa logo com AdvancedImageProcessingService se houver
      let processedLogoBase64 = ''
      let logoColors: any[] = []

      if (logos.length > 0) {
        console.log(`\n🎨 Processando logo com AdvancedImageProcessingService...`)
        const { AdvancedImageProcessingService } = await import('@/lib/services/image-processing')

        for (const logo of logos) {
          try {
            const result = await AdvancedImageProcessingService.processLogo(logo.src, {
              quality: 'high',
              preserveColors: true,
              removeBackground: logo.removingBg,
              segmentByColor: true,
              targetVinylInventory: [],
            })

            if (result.success) {
              processedLogoBase64 = logo.src
              logoColors = result.colorReport
              console.log(`   ✅ Logo processada: ${result.colorReport.length} cores detectadas`)
            }
          } catch (e) {
            console.warn(`⚠️ Erro ao processar logo:`, e)
          }
        }
      }

      // Envia para servidor
      console.log(`\n📤 Enviando para servidor...`)
      const payload = {
        state: {
          medida,
          corTapete,
          corTexto: textos.length > 0 ? textos[0].corId : 'branco',
          corBorda,
          borda,
          texto: textos.length > 0 ? textos[0].texto : '',
          fonte: textos.length > 0 ? textos[0].fonteId : 'bold',
          wpp,
          nome,
          customL,
          customC,
        },
        svgPreview: previewDataUrl,
        clientName: nome || 'Cliente',
        clientWhatsApp: wpp || '',
        logoBase64: processedLogoBase64,
      }

      console.log(`   Payload incluindo preview: ${payload.svgPreview ? 'SIM ✅' : 'NÃO ❌'}`)
      console.log(`   Preview size no payload: ${payload.svgPreview ? (payload.svgPreview.length / 1024).toFixed(2) : 0}KB`)

      const response = await fetch('/api/orders/criar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        console.log(`\n✅ PEDIDO CRIADO COM SUCESSO!`)
        console.log(`   ID: ${result.orderId}`)
        console.log(`   Pasta: ${result.storageFolder}`)
        console.log(`   Arquivos: ${result.tapFiles.length} .TAP`)

        // Abre página de confirmação
        window.open(`/gerados/${result.orderId}/`, '_blank')
        setOrderStep('done_download')
      } else {
        throw new Error(result.message || 'Erro ao criar pedido')
      }
    } catch (err: unknown) {
      console.error(`❌ Erro ao criar pedido:`, err)
      if ((err as { name?: string })?.name !== 'AbortError') alert(`Erro: ${err instanceof Error ? err.message : 'Desconhecido'}`)
      setOrderStep('idle')
    }
  }

  // ── Gerar Artefatos TAP ──
  async function gerarArtefatos() {
    setGerandoArtefatos(true)
    setArtefatosResult(null)
    try {
      const res = await fetch('/api/orders/gerar-tap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medida,
          corTapete,
          border: { type: borda === 'sem' ? 'none' : borda === 'fina' ? 'thin' : 'double', color: corBorda },
          textos: textos.filter(t => t.texto),
          logos,
          quantidade: 1,
          clienteName: nome || pedido || 'Cliente',
        }),
      })
      const data = await res.json()
      if (data.success) setArtefatosResult(data)
    } catch (e) {
      console.error(e)
    } finally {
      setGerandoArtefatos(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&family=Bebas+Neue&family=Montserrat:wght@700;800&family=Cinzel:wght@400;700&family=Pacifico&family=Playfair+Display:wght@700;900&family=Dancing+Script:wght@400;700&family=Oswald:wght@400;600;700&family=Nunito:wght@400;700;800&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.3;} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ minHeight: 'calc(100vh - 64px)', background: '#060E16', color: '#E2E8F0', fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>

        {/* Canal banner */}
        {(canal || adminConfig.aviso) && (
          <div style={{ padding: '0 14px' }}>
            {canal && (
              <div style={{
                background: canal === 'ml' ? 'rgba(52,131,250,.12)' : 'rgba(238,77,45,.12)',
                border: `1px solid ${canal === 'ml' ? 'rgba(52,131,250,.3)' : 'rgba(238,77,45,.3)'}`,
                borderRadius: '0 0 12px 12px', padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: '1rem' }}>{canal === 'ml' ? '🛒' : '🛍️'}</span>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '.78rem', color: canal === 'ml' ? '#60A5FA' : '#FB923C' }}>
                    {canal === 'ml' ? 'Compra via Mercado Livre' : 'Compra via Shopee'}
                  </span>
                  {pedido && (
                    <span style={{ marginLeft: 8, fontSize: '.72rem', color: '#94A3B8' }}>· Pedido #{pedido}</span>
                  )}
                  <span style={{ display: 'block', fontSize: '.68rem', color: '#64748B', marginTop: 1 }}>
                    Medida e cor foram pré-selecionadas — complete apenas a personalização abaixo.
                  </span>
                </div>
              </div>
            )}
            {adminConfig.aviso && (
              <div style={{ background: 'rgba(234,179,8,.08)', border: '1px solid rgba(234,179,8,.25)', borderRadius: 8, padding: '8px 14px', margin: '8px 0', fontSize: '.78rem', color: '#EAB308' }}>
                ⚠️ {adminConfig.aviso}
              </div>
            )}
          </div>
        )}

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', minHeight: 'calc(100vh - 64px)' }}>

          {/* PAINEL */}
          <div style={{ background: '#0B1520', borderRight: '1px solid rgba(34,197,94,.15)', padding: '16px 14px 32px', overflowY: 'auto', maxHeight: 'calc(100vh - 64px)' }}>

            {/* Dados */}
            <Section title="Seus dados">
              {(canal || pedidoInicial) && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '.55rem', color: '#2E4A6A', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Número do pedido</div>
                  <input
                    type="text" placeholder="Ex: ML-123456789"
                    value={pedido} onChange={e => setPedido(e.target.value)}
                    style={{ ...inputStyle, color: pedido ? '#22C55E' : '#E2E8F0', fontWeight: pedido ? 700 : 400 }}
                    readOnly={!!pedidoInicial}
                  />
                </div>
              )}
              <input type="text" placeholder="Seu nome ou empresa" value={nome} onChange={e => setNome(e.target.value)} style={{ ...inputStyle, marginBottom: 8 }} />
              <input type="tel" placeholder="WhatsApp com DDD" value={wpp} onChange={e => setWpp(e.target.value)} style={inputStyle} />
            </Section>

            {/* Medida */}
            <Section title="Medida do capacho" locked={!!lockedTamanho}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, pointerEvents: lockedTamanho ? 'none' : undefined, opacity: lockedTamanho ? 0.75 : 1 }}>
                {Object.entries(MEDIDAS).map(([id, md]) => (
                  <button key={id} onClick={() => setMedida(id)} disabled={!!lockedTamanho} style={{
                    padding: '9px 6px', borderRadius: 8, cursor: lockedTamanho ? 'not-allowed' : 'pointer', outline: 'none', fontSize: '.75rem', fontWeight: 600, textAlign: 'center', position: 'relative',
                    border: `1.5px solid ${medida === id ? '#22C55E' : 'rgba(255,255,255,.07)'}`,
                    background: medida === id ? 'rgba(34,197,94,.1)' : 'rgba(255,255,255,.02)',
                    color: medida === id ? '#22C55E' : '#94A3B8',
                  }}>
                    {md.l}
                    {(id === '60x90' || id === '80x120') && !lockedTamanho && <span style={{ position: 'absolute', top: -6, right: -4, background: '#22C55E', color: '#000', fontSize: '.52rem', fontWeight: 800, padding: '1px 5px', borderRadius: 5 }}>POP</span>}
                  </button>
                ))}
              </div>
              {medida === 'custom' && !lockedTamanho && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input type="text" placeholder="Largura (cm)" maxLength={4} value={customL} onChange={e => setCustomL(e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} />
                  <span style={{ display: 'flex', alignItems: 'center', color: '#4B6A8A', fontSize: '1.1rem' }}>×</span>
                  <input type="text" placeholder="Comprim. (cm)" maxLength={4} value={customC} onChange={e => setCustomC(e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} />
                </div>
              )}
              {preco && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 10, padding: '8px 14px', fontWeight: 800, fontSize: '1.1rem', color: '#22C55E' }}>
                    💰 {precoFmt} <span style={{ fontSize: '.65rem', fontWeight: 400, color: '#4ADE80', marginLeft: 4 }}>tapete pronto</span>
                  </div>
                </div>
              )}
            </Section>

            {/* Cor tapete */}
            <Section title="Cor do tapete" locked={!!lockedCor}>
              {lockedCor && !adminConfig.coresDisponiveis.includes(lockedCor) && (
                <div style={{ background: 'rgba(234,179,8,.08)', border: '1px solid rgba(234,179,8,.2)', borderRadius: 7, padding: '6px 10px', marginBottom: 8, fontSize: '.72rem', color: '#EAB308' }}>
                  ⚠️ Esta cor está temporariamente indisponível. Entraremos em contato.
                </div>
              )}
              <CoresRow cores={coresTapeteDisponiveis} ativo={corTapete} onSelect={setCorTapete} locked={!!lockedCor} />
            </Section>

            {/* TEXTOS */}
            <Section title="Textos personalizados">
              {textos.map((t, i) => (
                <div key={t.id} style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '.65rem', color: '#4ADE80', fontWeight: 700 }}>Texto {i + 1}</span>
                    <button onClick={() => removeTexto(t.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '.65rem', cursor: 'pointer' }}>✕ Remover</button>
                  </div>
                  <input type="text" placeholder="Digite o texto..." maxLength={40} value={t.texto} onChange={e => updateTexto(t.id, { texto: e.target.value })} style={{ ...inputStyle, marginBottom: 6 }} />
                  <div style={{ fontSize: '.6rem', color: '#2E4A6A', marginBottom: 6 }}>{t.texto.length}/40</div>
                  <div style={{ fontSize: '.55rem', color: '#2E4A6A', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Fonte</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                    {FONTES.map(f => (
                      <button key={f.id} onClick={() => updateTexto(t.id, { fonteId: f.id })} style={{
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
                  <input type="range" min={0} max={80} value={t.tamanho} onChange={e => updateTexto(t.id, { tamanho: Number(e.target.value) })} style={{ width: '100%', accentColor: '#22C55E', cursor: 'pointer', height: 4, marginBottom: 8 }} />
                  <div style={{ fontSize: '.55rem', color: '#2E4A6A', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Cor</div>
                  <CoresRow cores={CORES_TEXTO} ativo={t.corId} onSelect={corId => updateTexto(t.id, { corId })} />
                  <div style={{ fontSize: '.58rem', color: '#1E3550', textAlign: 'center', marginTop: 6 }}>✋ Arraste no preview para posicionar</div>
                </div>
              ))}
              <button onClick={addTexto} style={{ width: '100%', padding: '9px 14px', borderRadius: 8, cursor: 'pointer', outline: 'none', border: '1.5px dashed rgba(34,197,94,.3)', background: 'rgba(34,197,94,.04)', color: '#22C55E', fontSize: '.75rem', fontWeight: 700 }}>
                + Adicionar texto
              </button>
            </Section>

            {/* Acabamento */}
            <Section title="Acabamento">
              <div style={{ display: 'flex', gap: 7 }}>
                {BORDAS.map(b => (
                  <button key={b.id} onClick={() => setBorda(b.id)} style={{
                    flex: 1, padding: '7px 4px', borderRadius: 7, cursor: 'pointer', outline: 'none',
                    border: `1.5px solid ${borda === b.id ? '#22C55E' : 'rgba(255,255,255,.07)'}`,
                    background: borda === b.id ? 'rgba(34,197,94,.1)' : 'transparent',
                    color: borda === b.id ? '#22C55E' : '#94A3B8', fontSize: '.7rem', fontWeight: 600,
                  }}>{b.l}</button>
                ))}
              </div>
            </Section>

            {borda !== 'sem' && (
              <Section title="Cor da borda">
                <CoresRow cores={CORES_BORDA} ativo={corBorda} onSelect={setCorBorda} />
              </Section>
            )}

            {/* LOGOS */}
            <Section title="Logos (múltiplas)">
              {logos.map((lg, i) => {
                const rotExibe = lg.rotacao > 180 ? lg.rotacao - 360 : lg.rotacao
                return (
                  <div key={lg.id} style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: '.65rem', color: '#4ADE80', fontWeight: 700 }}>
                        Logo {i + 1}
                        {lg.removingBg && <span style={{ marginLeft: 6, fontSize: '.6rem', color: '#EAB308' }}>⏳ Processando...</span>}
                      </span>
                      <button onClick={() => removeLogo(lg.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '.65rem', cursor: 'pointer' }}>✕</button>
                    </div>
                    <img src={lg.src} style={{ height: 38, borderRadius: 4, objectFit: 'contain', background: 'rgba(255,255,255,.05)', marginBottom: 8 }} alt="Logo do usuário para personalização do capacho" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: '.62rem', color: '#2E4A6A' }}>Tamanho</span>
                      <span style={{ fontSize: '.62rem', color: '#22C55E', fontWeight: 700 }}>{lg.scale}%</span>
                    </div>
                    <input type="range" min={30} max={190} value={lg.scale} onChange={e => updateLogo(lg.id, { scale: Number(e.target.value) })} style={{ width: '100%', accentColor: '#22C55E', cursor: 'pointer', height: 4 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: '.62rem', color: '#2E4A6A' }}>Rotação</span>
                      <span style={{ fontSize: '.68rem', color: '#22C55E', fontWeight: 800 }}>{rotExibe}°</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => updateLogo(lg.id, { rotacao: (lg.rotacao - 15 + 360) % 360 })} style={rotBtnStyle}>↺ −15°</button>
                      <button onClick={() => updateLogo(lg.id, { rotacao: 0 })} style={rotBtnStyle}>Reset</button>
                      <button onClick={() => updateLogo(lg.id, { rotacao: (lg.rotacao + 15) % 360 })} style={rotBtnStyle}>+15° ↻</button>
                    </div>
                    <div style={{ fontSize: '.58rem', color: '#1E3550', textAlign: 'center', marginTop: 6 }}>✋ Arraste no preview</div>
                  </div>
                )
              })}
              <input type="file" accept="image/*" style={{ display: 'none' }} ref={el => { fileRefs.current['new'] = el }} onChange={e => { const f = e.target.files?.[0]; if (f) addLogo(f); e.target.value = '' }} />
              <button onClick={() => fileRefs.current['new']?.click()} style={{ width: '100%', padding: '9px 14px', borderRadius: 8, cursor: 'pointer', outline: 'none', border: '1.5px dashed rgba(34,197,94,.3)', background: 'rgba(34,197,94,.04)', color: '#22C55E', fontSize: '.75rem', fontWeight: 700 }}>
                + Adicionar logo (PNG, JPG, SVG)
              </button>
            </Section>

            {/* CTA */}
            <div style={{ padding: '4px 0 8px' }}>

              {/* Checkbox de aprovação */}
              <label
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
                  background: aprovado ? 'rgba(34,197,94,.07)' : 'rgba(255,255,255,.03)',
                  border: `1px solid ${aprovado ? 'rgba(34,197,94,.35)' : 'rgba(255,255,255,.09)'}`,
                  borderRadius: 10, padding: '10px 12px', marginBottom: 10,
                  transition: 'background .2s, border-color .2s',
                }}
              >
                <input
                  type="checkbox"
                  checked={aprovado}
                  disabled={orderStep === 'building'}
                  onChange={e => { setAprovado(e.target.checked); setOrderStep('idle') }}
                  style={{ marginTop: 2, accentColor: '#22C55E', width: 15, height: 15, flexShrink: 0 }}
                />
                <span style={{ fontSize: '.72rem', color: aprovado ? '#4ADE80' : '#64748B', lineHeight: 1.5, fontWeight: 600 }}>
                  Revisei o preview acima e aprovo esta arte para produção
                </span>
              </label>

              {/* Botão principal */}
              <button
                onClick={criarPedido}
                disabled={!aprovado || orderStep === 'building'}
                style={{
                  display: 'flex', width: '100%', padding: '14px 16px', marginBottom: 8,
                  background: (!aprovado || orderStep === 'building')
                    ? 'rgba(34,197,94,.25)'
                    : orderStep === 'done_share' || orderStep === 'done_download'
                    ? 'linear-gradient(135deg,#22C55E,#15803D)'
                    : 'linear-gradient(135deg,#22C55E,#15803D)',
                  border: 'none', borderRadius: 11,
                  color: (!aprovado || orderStep === 'building') ? 'rgba(255,255,255,.4)' : '#fff',
                  fontSize: '.9rem', fontWeight: 800,
                  cursor: (!aprovado || orderStep === 'building') ? 'not-allowed' : 'pointer',
                  boxShadow: aprovado && orderStep === 'idle' ? '0 8px 24px rgba(34,197,94,.35)' : 'none',
                  alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all .25s',
                }}
              >
                {orderStep === 'building' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                )}
                {orderStep === 'idle' && 'Criar pedido'}
                {orderStep === 'building' && 'Gerando arquivos...'}
                {orderStep === 'done_share' && '✓ Pronto — selecione WhatsApp e envie'}
                {orderStep === 'done_download' && '✓ Arquivos baixados — confira o WhatsApp'}
              </button>

              {/* Instruções pós-ação (desktop) */}
              {orderStep === 'done_download' && (
                <div style={{ marginBottom: 8, background: 'rgba(96,165,250,.07)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 9, padding: '9px 12px' }}>
                  <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#60A5FA', marginBottom: 3 }}>
                    preview-capacho.jpg + pedido-entratta.pdf baixados
                  </div>
                  <div style={{ fontSize: '.68rem', color: '#94A3B8', lineHeight: 1.5 }}>
                    No WhatsApp que abriu, clique no clipe (anexo) e selecione os dois arquivos para enviar à loja.
                  </div>
                </div>
              )}

              <p style={{ fontSize: '.63rem', color: '#1E3550', textAlign: 'center', marginTop: 10, lineHeight: 1.6 }}>
                ✓ {adminConfig.diasUteis} dias úteis · ✓ Entrega em todo o Brasil · ✓ Sem compromisso
              </p>

              {pastaFinal && (
                <div style={{ marginTop: 8, background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 10, padding: '9px 12px' }}>
                  <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#22C55E', marginBottom: 3 }}>
                    ✓ Pedido salvo na pasta de produção
                  </div>
                  <code style={{ fontSize: '.63rem', color: '#4ADE80' }}>{pastaFinal}/</code>
                </div>
              )}
            </div>
          </div>

          {/* PREVIEW */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 20px', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(34,197,94,.07)', border: '1px solid rgba(34,197,94,.18)', borderRadius: 20, padding: '5px 14px' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="1" y="4" width="8" height="1.5" rx="0.75" fill="#22C55E" opacity="0.6"/>
                <rect x="4" y="1" width="1.5" height="8" rx="0.75" fill="#22C55E" opacity="0.6"/>
              </svg>
              <span style={{ fontSize: '.68rem', color: '#22C55E', fontWeight: 700, letterSpacing: '.5px' }}>VER COMO VAI FICAR</span>
            </div>

            <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{
              borderRadius: 14, boxShadow: '0 24px 64px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.05)',
              display: 'block', maxWidth: '100%',
            }}>
              <defs>
                {corTapeteObj.tint && (
                  <filter id="carpet-tint" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
                    <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="gray"/>
                    <feFlood floodColor={corTapeteObj.tint} floodOpacity="1" result="color"/>
                    <feBlend in="gray" in2="color" mode="overlay"/>
                  </filter>
                )}
              </defs>
              <image href={corTapeteObj.imageSrc} x={0} y={0} width={W} height={H} preserveAspectRatio="xMidYMid slice" filter={corTapeteObj.tint ? 'url(#carpet-tint)' : undefined} />
              {borda === 'fina' && <rect x={PAD / 2} y={PAD / 2} width={W - PAD} height={H - PAD} rx={8} fill="none" stroke={bordaHex} strokeWidth={4} opacity={0.8} />}
              {borda === 'dupla' && <>
                <rect x={PAD / 2} y={PAD / 2} width={W - PAD} height={H - PAD} rx={8} fill="none" stroke={bordaHex} strokeWidth={5} opacity={0.8} />
                <rect x={PAD} y={PAD} width={W - PAD * 2} height={H - PAD * 2} rx={5} fill="none" stroke={bordaHex} strokeWidth={2} opacity={0.45} />
              </>}
              <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="#22C55E" strokeWidth={1.2} strokeDasharray="5,4" opacity={showGuides.v ? 1 : 0} pointerEvents="none" />
              <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#22C55E" strokeWidth={1.2} strokeDasharray="5,4" opacity={showGuides.h ? 1 : 0} pointerEvents="none" />
              <circle cx={W / 2} cy={H / 2} r={6} fill="none" stroke="#22C55E" strokeWidth={1.5} opacity={showGuides.v && showGuides.h ? 1 : 0} pointerEvents="none" />
              {logos.map((lg, i) => {
                const baseLW = Math.min(130, W * 0.32)
                const baseLH = Math.min(90, H * 0.38)
                const lw = baseLW * (lg.scale / 100)
                const lh = baseLH * (lg.scale / 100)
                const defaultX = W / 2
                const defaultY = (i + 1) * H / (logos.length + textos.length + 1)
                const cx = lg.x ?? defaultX
                const cy = lg.y ?? defaultY
                return (
                  <g key={lg.id}>
                    <image href={lg.src} x={cx - lw / 2} y={cy - lh / 2} width={lw} height={lh} preserveAspectRatio="xMidYMid meet"
                      transform={lg.rotacao !== 0 ? `rotate(${lg.rotacao},${cx},${cy})` : undefined}
                      opacity={lg.removingBg ? 0.5 : 1} />
                    <rect x={cx - lw / 2 - 6} y={cy - lh / 2 - 6} width={lw + 12} height={lh + 12} fill="rgba(0,0,0,0)" cursor="move" rx={4}
                      onMouseDown={e => startDrag(e, 'logo', lg.id, cx, cy)}
                      onTouchStart={e => startDrag(e, 'logo', lg.id, cx, cy)}
                      style={{ touchAction: 'none' }} />
                  </g>
                )
              })}
              {textos.map((t, i) => {
                if (!t.texto) return null
                const fonteObj = FONTES.find(f => f.id === t.fonteId)!
                const corObj = CORES_TEXTO.find(c => c.id === t.corId)!
                const fs = t.tamanho || Math.min(42, Math.max(12, Math.floor(W / (t.texto.length * 0.60 + 1))))
                const defaultX = W / 2
                const defaultY = (logos.length + i + 1) * H / (logos.length + textos.length + 1)
                const tx = t.x ?? defaultX
                const ty = t.y ?? defaultY
                const estW = Math.min(W - 20, fs * t.texto.length * 0.62 + 16)
                const estH = fs * 1.5
                const ls = t.fonteId === 'romana' ? 4 : t.fonteId === 'moderna' ? 3 : 2
                const clipId = `clip-txt-${t.id}`
                const patId = `pat-txt-${t.id}`
                const darker = adjustHex(corObj.hex, -50)
                const textProps = {
                  x: tx, y: ty, textAnchor: 'middle' as const, dominantBaseline: 'central' as const,
                  fontSize: fs, fontFamily: fonteObj.f, fontWeight: fonteObj.w, letterSpacing: ls,
                }
                return (
                  <g key={t.id}>
                    <defs>
                      <clipPath id={clipId}>
                        <text {...textProps}>{t.texto.toUpperCase()}</text>
                      </clipPath>
                      <pattern id={patId} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect width="20" height="20" fill={corObj.hex} />
                        <path d="M0,6 C2.5,2 8,10 10,6 C13,2 18,10 20,6" fill="none"
                          stroke={darker} strokeWidth="1.5" strokeLinecap="round" opacity={0.45} />
                        <path d="M0,14 C3,10 8.5,18 10,14 C13,10 18,18 20,14" fill="none"
                          stroke={darker} strokeWidth="1.1" strokeLinecap="round" opacity={0.3} />
                      </pattern>
                    </defs>
                    {/* Emboss shadow — depth impression */}
                    <text {...textProps} x={tx + 1.5} y={ty + 2}
                      fill="rgba(0,0,0,0.5)" pointerEvents="none">
                      {t.texto.toUpperCase()}
                    </text>
                    {/* Vinyl texture body — wave pattern clipped to text shape */}
                    <rect x={tx - W} y={ty - H} width={W * 3} height={H * 3}
                      fill={`url(#${patId})`} clipPath={`url(#${clipId})`} pointerEvents="none" />
                    {/* Top-left highlight — emboss 3D edge */}
                    <text {...textProps} x={tx - 0.7} y={ty - 1}
                      fill="rgba(255,255,255,0.14)" pointerEvents="none">
                      {t.texto.toUpperCase()}
                    </text>
                    {/* Hit area for drag */}
                    <rect x={tx - estW / 2} y={ty - estH / 2} width={estW} height={estH}
                      fill="rgba(0,0,0,0)" cursor="move" rx={4}
                      onMouseDown={e => startDrag(e, 'texto', t.id, tx, ty)}
                      onTouchStart={e => startDrag(e, 'texto', t.id, tx, ty)}
                      style={{ touchAction: 'none' }} />
                  </g>
                )
              })}
              {textos.length === 0 && logos.length === 0 && (
                <text x={W / 2} y={H / 2} textAnchor="middle" dominantBaseline="central"
                  fill="rgba(255,255,255,0.15)" fontSize={13} fontFamily="Inter,sans-serif" fontWeight={500} letterSpacing={3}>
                  ADICIONE TEXTOS E LOGOS
                </text>
              )}
              <text x={W - 10} y={H - 10} textAnchor="end" fontFamily="Inter,sans-serif" fontSize={11} fontWeight={600} fill="rgba(255,255,255,0.25)" letterSpacing={0.5}>
                {medidaLabel}
              </text>
            </svg>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, width: '100%', maxWidth: 480 }}>
              {[
                { l: 'Medida', v: medidaLabel },
                { l: 'Cor', v: corTapeteObj.label },
                { l: 'Textos', v: textos.filter(t => t.texto).length > 0 ? textos.filter(t => t.texto).length.toString() : '—' },
                { l: 'Preço', v: precoFmt, green: true },
              ].map(c => (
                <div key={c.l} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: '.58rem', color: '#2E4A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 2 }}>{c.l}</div>
                  <div style={{ fontSize: '.74rem', color: (c as any).green ? '#22C55E' : '#E2E8F0', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.v}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['✓ Sem compromisso', '✓ Orçamento em minutos', '✓ Entrega todo o Brasil', `✓ Produção em ${adminConfig.diasUteis} dias úteis`].map(g => (
                <span key={g} style={{ fontSize: '.68rem', color: '#1E3A5C', fontWeight: 600 }}>{g}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
