import {
  ShieldIcon,
  PrintIcon,
  LayersIcon,
  PaletteIcon,
  RulerIcon,
  ZapIcon,
} from '@/components/icons/BenefitIcons'

const TITLES = [
  'Vinil de Alta Resistência',
  'Impressão Sublimação 300 DPI',
  'Base Antiderrapante',
  'Personalização Total',
  'Medidas sob Medida',
  'Produção em 7 Dias Úteis',
]

const DESCS = [
  'Material premium resistente ao tráfego intenso, água e produtos de limpeza. Dura anos sem desbotamento.',
  'Cores vivas e detalhes precisos. Sua logo é reproduzida com fidelidade máxima, inclusive degradês e detalhes finos.',
  'Base em borracha com alta aderência. Não desliza mesmo em pisos molhados — segurança para clientes e funcionários.',
  'Escolha cor, textura, texto, fonte e borda. Upload de logo em PNG, JPG ou SVG. Tudo configurável antes de comprar.',
  'Do padrão 40×60 cm ao 100×150 cm, ou informe as medidas exatas do seu espaço. Qualquer dimensão é possível.',
  'Do pedido confirmado até a sua porta em até 7 dias úteis. Entrega segura para todo o Brasil com rastreamento.',
]

const cardClass = 'card-hover rounded-2xl p-7 glass-card'
const iconColor = { color: '#22C55E' as const }

export function Benefits() {
  return (
    <section
      id="beneficios"
      className="px-4 py-20 md:py-28"
      style={{ background: '#060E16' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#22C55E',
              letterSpacing: '1.5px',
            }}
          >
            POR QUE ENTRATTA
          </span>
          <h2
            className="section-title-glow"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              color: '#fff',
              letterSpacing: 0,
            }}
          >
            Qualidade que se vê,{' '}
            <span style={{ color: '#4ADE80', fontStyle: 'italic' }}>durabilidade que se sente</span>
          </h2>
        </div>

        <div className="benefits-bento">
          <article className={cardClass} style={{ gridColumn: 'span 2' }}>
            <div className="mb-4" style={iconColor}><ShieldIcon size={28} /></div>
            <h3 className="font-bold text-white mb-2 text-base">{TITLES[0]}</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.7 }}>{DESCS[0]}</p>
          </article>

          <article className={cardClass}>
            <div className="mb-4" style={iconColor}><PrintIcon size={28} /></div>
            <h3 className="font-bold text-white mb-2 text-base">{TITLES[1]}</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.7 }}>{DESCS[1]}</p>
          </article>

          <article className={cardClass}>
            <div className="mb-4" style={iconColor}><LayersIcon size={28} /></div>
            <h3 className="font-bold text-white mb-2 text-base">{TITLES[2]}</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.7 }}>{DESCS[2]}</p>
          </article>

          <article className={cardClass} style={{ gridColumn: 'span 2' }}>
            <div className="mb-4" style={iconColor}><PaletteIcon size={28} /></div>
            <h3 className="font-bold text-white mb-2 text-base">{TITLES[3]}</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.7 }}>{DESCS[3]}</p>
          </article>

          <article className={cardClass}>
            <div className="mb-4" style={iconColor}><RulerIcon size={28} /></div>
            <h3 className="font-bold text-white mb-2 text-base">{TITLES[4]}</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.7 }}>{DESCS[4]}</p>
          </article>

          <article
            className="card-hover rounded-2xl p-7"
            style={{
              gridColumn: 'span 2',
              background: 'rgba(34,197,94,0.09)',
              border: '1px solid rgba(34,197,94,0.25)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div className="mb-4" style={iconColor}><ZapIcon size={28} /></div>
            <h3 className="font-bold mb-2 text-base" style={{ color: '#22C55E' }}>{TITLES[5]}</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.7 }}>{DESCS[5]}</p>
          </article>
        </div>
      </div>
    </section>
  )
}
