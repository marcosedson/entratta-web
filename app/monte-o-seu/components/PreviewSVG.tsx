'use client'

import { aciByCode } from '@/lib/constants/aci-palette'
import type { RegiaoLogo } from '@/lib/types/producao'

import { autoFontSize, logoGeometry } from '../hooks/useConfigurador'
import { CORES_PINTURA, CORES_TAPETE, FONTES, LogoItem, TextoItem } from '../types'
import { adjustHex } from './ui'

/** Path SVG (even-odd) das regiões vetorizadas do logo, no espaço local do vetor. */
function regiaoPath(regiao: RegiaoLogo): string {
  const ring = (pts: [number, number][]) =>
    pts.length ? `M${pts.map(([x, y]) => `${x},${y}`).join('L')}Z` : ''
  return regiao.poligonos
    .map(p => ring(p.externo) + p.furos.map(f => ring(f)).join(''))
    .join('')
}

interface Props {
  W: number
  H: number
  corTapete: string
  borda: string
  corBordaAci: string
  textos: TextoItem[]
  logos: LogoItem[]
  medidaLabel: string
  showGuides: { v: boolean; h: boolean }
  svgRef: React.RefObject<SVGSVGElement | null>
  startDrag: (e: React.MouseEvent | React.TouchEvent, target: 'logo' | 'texto', itemId: string, curX: number, curY: number) => void
}

export function PreviewSVG({
  W, H, corTapete, borda, corBordaAci, textos, logos, medidaLabel, showGuides, svgRef, startDrag,
}: Props) {
  const PAD = 18
  const corTapeteObj = CORES_TAPETE.find(c => c.id === corTapete) ?? CORES_TAPETE[0]
  const bordaHex = aciByCode(Number(corBordaAci))?.hex ?? '#EBEBEB'
  const totalItens = logos.length + textos.length

  return (
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
        const { cx, cy, lw, lh, s } = logoGeometry(lg, i, W, H, totalItens)
        return (
          <g key={lg.id} transform={lg.rotacao !== 0 ? `rotate(${lg.rotacao},${cx},${cy})` : undefined}>
            {lg.vetor ? (
              // logo vetorizado: o que se vê é exatamente o que será pintado
              <g transform={`translate(${cx - (lg.vetor.largura_px * s) / 2},${cy - (lg.vetor.altura_px * s) / 2}) scale(${s})`}>
                {lg.vetor.regioes.map((r, ri) => (
                  <path key={ri} d={regiaoPath(r)} fill={aciByCode(r.aci)?.hex ?? '#EBEBEB'} fillRule="evenodd" />
                ))}
              </g>
            ) : (
              <image href={lg.src} x={cx - lw / 2} y={cy - lh / 2} width={lw} height={lh} preserveAspectRatio="xMidYMid meet" opacity={0.5} />
            )}
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
        const corHex = CORES_PINTURA.find(c => c.aci === t.aci)?.hex ?? '#EBEBEB'
        const fs = t.tamanho || autoFontSize(t.texto, W)
        const tx = t.x ?? W / 2
        const ty = t.y ?? ((logos.length + i + 1) * H) / (totalItens + 1)
        const estW = Math.min(W - 20, fs * t.texto.length * 0.62 + 16)
        const estH = fs * 1.5
        const ls = t.fonteId === 'romana' ? 4 : t.fonteId === 'moderna' ? 3 : 2
        const clipId = `clip-txt-${t.id}`
        const patId = `pat-txt-${t.id}`
        const darker = adjustHex(corHex, -50)
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
                <rect width="20" height="20" fill={corHex} />
                <path d="M0,6 C2.5,2 8,10 10,6 C13,2 18,10 20,6" fill="none"
                  stroke={darker} strokeWidth="1.5" strokeLinecap="round" opacity={0.45} />
                <path d="M0,14 C3,10 8.5,18 10,14 C13,10 18,18 20,14" fill="none"
                  stroke={darker} strokeWidth="1.1" strokeLinecap="round" opacity={0.3} />
              </pattern>
            </defs>
            <text {...textProps} x={tx + 1.5} y={ty + 2} fill="rgba(0,0,0,0.5)" pointerEvents="none">
              {t.texto.toUpperCase()}
            </text>
            <rect x={tx - W} y={ty - H} width={W * 3} height={H * 3}
              fill={`url(#${patId})`} clipPath={`url(#${clipId})`} pointerEvents="none" />
            <text {...textProps} x={tx - 0.7} y={ty - 1} fill="rgba(255,255,255,0.14)" pointerEvents="none">
              {t.texto.toUpperCase()}
            </text>
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
  )
}
