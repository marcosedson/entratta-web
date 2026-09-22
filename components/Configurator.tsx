'use client'

import { useId } from 'react'
import { useConfigurator } from '@/lib/hooks'
import {
  CARPET_COLORS,
  TEXT_COLORS,
  BORDER_COLORS,
  MEASUREMENTS,
  BORDERS,
  FONTS,
  CONFIGURATOR_PADDING,
} from '@/lib/constants'
import { ColorChip } from './Configurator/ColorChip'
import { SectionTitle } from './Configurator/SectionTitle'

// ── HELPERS (Maintain compatibility) ───────────────────────────────────────────

const CORES_TAPETE = CARPET_COLORS
const CORES_TEXTO = TEXT_COLORS
const CORES_BORDA = BORDER_COLORS
const MEDIDAS = MEASUREMENTS
const BORDAS = BORDERS
const FONTES = FONTS
const PAD = CONFIGURATOR_PADDING

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export function Configurator() {
  const uid = useId()
  const patternId = `vinyl-${uid.replace(/:/g, '')}`
  const patternLightId = `vinyl-light-${uid.replace(/:/g, '')}`

  const {
    state: s,
    set,
    svgW,
    svgH,
    medidaLabel,
    preco,
    corTapeteObj,
    corTextoObj,
    fonteObj,
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
  } = useConfigurator()

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
          <SectionTitle>Seus dados</SectionTitle>
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
          <SectionTitle>Medida do capacho</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
            {Object.entries(MEDIDAS).filter(([, m]) => !m.legacy).map(([key, m]) => (
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
          <SectionTitle>Cor do tapete</SectionTitle>
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
          <SectionTitle>Texto personalizado</SectionTitle>
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
          <SectionTitle>Cor do texto</SectionTitle>
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
          <SectionTitle>Acabamento</SectionTitle>
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
            <SectionTitle>Cor da borda</SectionTitle>
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
          <SectionTitle>Logo da empresa (opcional)</SectionTitle>
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
