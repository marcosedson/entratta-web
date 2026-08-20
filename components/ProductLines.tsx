'use client'

import { useState, useRef } from 'react'

const WPP = (msg: string) =>
  `https://wa.me/5564992066855?text=${encodeURIComponent(msg)}`

interface Category {
  id: string
  tag: string
  title: string
  sublabel: string
  accent: string
  accentRgb: string
  cardBg: string
  previewBg: string
  previewLabel: string
  previewSub: string
  tags: string[]
  cta: { text: string; href: string; external: boolean }
}

const CATEGORIES: Category[] = [
  {
    id: 'empresa',
    tag: 'B2B',
    title: 'Sua empresa na entrada',
    sublabel: 'Escritórios · Clínicas · Lojas · Academias · Condomínios',
    accent: '#60A5FA',
    accentRgb: '96,165,250',
    cardBg: '#060C18',
    previewBg: '#0A1628',
    previewLabel: 'SUA LOGO',
    previewSub: 'IDENTIDADE VISUAL',
    tags: ['Logo e marca', 'Nome da empresa', 'Arte exclusiva', 'Sob medida'],
    cta: { text: 'Pedir com minha logo', href: WPP('Olá! Quero um capacho personalizado com a logo da minha empresa. Podem me ajudar?'), external: true },
  },
  {
    id: 'casa',
    tag: 'RESIDENCIAL',
    title: 'Personalidade em casa',
    sublabel: 'Apartamento · Casa · Família · Casa nova',
    accent: '#4ADE80',
    accentRgb: '74,222,128',
    cardBg: '#060F09',
    previewBg: '#071A0B',
    previewLabel: 'BEM VINDO',
    previewSub: 'RESIDENCIAL',
    tags: ['Bem-vindo', 'Nome da família', 'Número/endereço', 'Presente casa nova'],
    cta: { text: 'Pedir pelo WhatsApp', href: WPP('Olá! Tenho interesse em capacho residencial. Podem me mostrar as opções disponíveis?'), external: true },
  },
  {
    id: 'churrasco',
    tag: 'LAZER',
    title: 'Churrasco e área gourmet',
    sublabel: 'Churrasqueira · Varanda · Área de lazer · Presente',
    accent: '#FB923C',
    accentRgb: '251,146,60',
    cardBg: '#0F0800',
    previewBg: '#1A0D00',
    previewLabel: 'CHURRASCO',
    previewSub: 'DO PAI',
    tags: ['"Churrasco do Pai"', 'Clube do Churrasco', 'Frases divertidas', 'Área gourmet'],
    cta: { text: 'Ver modelos temáticos', href: WPP('Olá! Quero um capacho para área de churrasco. Podem me mostrar os modelos e frases disponíveis?'), external: true },
  },
  {
    id: 'presente',
    tag: 'PRESENTE',
    title: 'Presente que emociona',
    sublabel: 'Casamento · Aniversário · Pets · Housewarming',
    accent: '#F472B6',
    accentRgb: '244,114,182',
    cardBg: '#150810',
    previewBg: '#1F0B16',
    previewLabel: 'PRESENTE',
    previewSub: 'PERSONALIZADO',
    tags: ['Presente casamento', 'Pets', 'Frases engraçadas', 'Aniversário'],
    cta: { text: 'Ver ideias de presente', href: WPP('Olá! Quero um capacho personalizado de presente. Podem me mostrar opções?'), external: true },
  },
]

function VinylPreview({
  cat,
  hovered,
}: {
  cat: Category
  hovered: boolean
}) {
  const pid = `vp-${cat.id}`
  const scaleStyle: React.CSSProperties = {
    transform: hovered ? 'scale(1.06)' : 'scale(1)',
    transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
  }
  return (
    <div
      style={{
        position: 'relative',
        height: '160px',
        overflow: 'hidden',
        background: cat.previewBg,
      }}
    >
      {/* SVG: background pattern + corner accents only */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, ...scaleStyle }}
      >
        <defs>
          <pattern
            id={pid}
            x="0"
            y="0"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,7 C2.5,3 8,10 11,7 C14,4 19.5,10 22,7"
              fill="none"
              stroke={`rgba(${cat.accentRgb},0.12)`}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M0,16 C3,12.5 8.5,19 11,16 C14,13 19.5,19 22,16"
              fill="none"
              stroke={`rgba(${cat.accentRgb},0.07)`}
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={cat.previewBg} />
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
        <rect
          x="16" y="16" width="40" height="1.5" rx="1"
          fill={cat.accent}
          opacity={hovered ? 0.9 : 0.4}
          style={{ transition: 'opacity 0.3s' }}
        />
        <rect
          x="16" y="16" width="1.5" height="40" rx="1"
          fill={cat.accent}
          opacity={hovered ? 0.9 : 0.4}
          style={{ transition: 'opacity 0.3s' }}
        />
      </svg>

      {/* Text overlay — HTML scales naturally via CSS */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 12px',
          gap: '7px',
          pointerEvents: 'none',
          ...scaleStyle,
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(0.85rem, 3.8vw, 1.75rem)',
            letterSpacing: 'clamp(2px, 0.6vw, 6px)',
            color: hovered ? cat.accent : '#E2E8F0',
            transition: 'color 0.3s',
            textAlign: 'center',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1,
          }}
        >
          {cat.previewLabel}
        </span>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(0.48rem, 1.1vw, 0.54rem)',
            letterSpacing: 'clamp(1px, 0.4vw, 4px)',
            color: cat.accent,
            opacity: hovered ? 0.9 : 0.4,
            transition: 'opacity 0.3s',
            textAlign: 'center',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {cat.previewSub}
        </span>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '56px',
          background: `linear-gradient(to top, ${cat.cardBg} 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

function CategoryCard({ cat }: { cat: Category }) {
  const [hovered, setHovered] = useState(false)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [shine, setShine] = useState({ x: 50, y: 50 })
  const ref = useRef<HTMLElement>(null)

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    setRot({ x: (ny - 0.5) * -14, y: (nx - 0.5) * 14 })
    setShine({ x: nx * 100, y: ny * 100 })
  }

  function handleMouseLeave() {
    setHovered(false)
    setRot({ x: 0, y: 0 })
    setShine({ x: 50, y: 50 })
  }

  const tracking = hovered && (rot.x !== 0 || rot.y !== 0)

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: '20px',
        border: `1px solid ${hovered ? `rgba(${cat.accentRgb},0.45)` : '#E2E8F0'}`,
        background: hovered
          ? `linear-gradient(160deg, rgba(${cat.accentRgb},0.06) 0%, #FFFFFF 60%)`
          : '#FFFFFF',
        transform: hovered
          ? `perspective(900px) rotateX(${rot.x}deg) rotateY(${rot.y}deg) translateY(-8px) scale(1.01)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 20px 60px rgba(${cat.accentRgb},0.15), 0 4px 16px rgba(0,0,0,0.08)`
          : '0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px #F1F5F9',
        transition: tracking
          ? 'transform 0.08s ease, box-shadow 0.4s, border-color 0.4s, background 0.4s'
          : 'all 0.55s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'default',
        willChange: 'transform',
      }}
    >
      <VinylPreview cat={cat} hovered={hovered} />

      <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '10px' }}>
          <span
            style={{
              fontSize: '0.6rem',
              fontWeight: 800,
              letterSpacing: '2.5px',
              color: cat.accent,
              opacity: 0.8,
            }}
          >
            {cat.tag}
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
            color: '#0F172A',
            lineHeight: 1.2,
            marginBottom: '6px',
            transition: 'color 0.3s',
          }}
        >
          {cat.title}
        </h3>

        <p
          style={{
            fontSize: '0.72rem',
            color: '#475569',
            lineHeight: 1.5,
            marginBottom: '16px',
            letterSpacing: '0.2px',
          }}
        >
          {cat.sublabel}
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '20px',
            flex: 1,
          }}
        >
          {cat.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '0.67rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '8px',
                background: hovered
                  ? `rgba(${cat.accentRgb},0.08)`
                  : '#F8FAFC',
                border: `1px solid ${hovered ? `rgba(${cat.accentRgb},0.3)` : '#E2E8F0'}`,
                color: hovered ? cat.accent : '#475569',
                transition: 'all 0.3s ease',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {cat.cta.external ? (
          <a
            href={cat.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              background: hovered
                ? `rgba(${cat.accentRgb},0.1)`
                : '#F8FAFC',
              border: `1px solid ${hovered ? `rgba(${cat.accentRgb},0.4)` : '#E2E8F0'}`,
              color: hovered ? cat.accent : '#475569',
              transition: 'all 0.35s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {cat.cta.text}
          </a>
        ) : (
          <a
            href={cat.cta.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              background: hovered
                ? 'linear-gradient(135deg,#22C55E,#15803D)'
                : 'rgba(34,197,94,0.08)',
              border: `1px solid ${hovered ? 'transparent' : 'rgba(34,197,94,0.2)'}`,
              color: hovered ? '#000' : '#15803D',
              boxShadow: hovered ? '0 6px 28px rgba(34,197,94,0.35)' : 'none',
              transition: 'all 0.35s ease',
            }}
          >
            {cat.cta.text}
          </a>
        )}
      </div>

      {/* Shine overlay — segue o cursor, cria efeito de luz reflexiva no vinil */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '20px',
          pointerEvents: 'none',
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(${cat.accentRgb},0.18) 0%, transparent 55%)`,
          opacity: hovered ? 1 : 0,
          transition: tracking ? 'opacity 0.1s' : 'opacity 0.4s ease',
        }}
      />
    </article>
  )
}

export function ProductLines() {
  return (
    <section id="produtos" className="px-4 py-20 md:py-28" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 md:mb-14">
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '2.5px',
              color: '#15803D',
              marginBottom: '14px',
            }}
          >
            O QUE VOCÊ ESTÁ PROCURANDO?
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              color: '#0F172A',
              lineHeight: 1.1,
              maxWidth: '600px',
            }}
          >
            Para cada espaço,{' '}
            <span style={{ color: '#16A34A', fontStyle: 'italic' }}>o tapete certo</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  )
}
