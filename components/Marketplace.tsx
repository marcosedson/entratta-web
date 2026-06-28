import { ShopeeIcon } from '@/components/icons/ShopeeIcon'
import { MercadoLivreIcon } from '@/components/icons/MercadoLivreIcon'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

const WPP_URL = 'https://wa.me/5564992066855'

export function Marketplace() {
  return (
    <section
      id="marketplaces"
      className="px-4 py-20 md:py-28"
      style={{ background: '#060E16' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            NOSSAS LOJAS OFICIAIS
          </span>
          <h2
            className="section-title-glow mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              color: '#fff',
              letterSpacing: 0,
            }}
          >
            Compre também nas{' '}
            <span style={{ color: '#4ADE80', fontStyle: 'italic' }}>maiores plataformas do Brasil</span>
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Mesmos produtos, mesma qualidade — com parcelamento em até 12x e a proteção
            dos maiores e-commerces do país.
          </p>
        </div>

        {/* Marketplace cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Shopee */}
          <div
            className="rounded-2xl p-8 flex flex-col gap-5"
            style={{
              background: 'rgba(238,77,45,0.04)',
              border: '1px solid rgba(238,77,45,0.2)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <ShopeeIcon size={52} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: '1.6rem',
                    letterSpacing: '2px',
                    color: '#EE4D2D',
                    lineHeight: 1,
                  }}
                >
                  SHOPEE
                </div>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Loja Oficial Entratta</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span style={{ color: '#EAB308', fontSize: '1rem' }}>★★★★★</span>
              <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>4.9 · +300 vendas</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Parcele em até 12x', 'Entrega Shopee', 'Compra Garantida'].map(b => (
                <span
                  key={b}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(238,77,45,0.08)',
                    border: '1px solid rgba(238,77,45,0.18)',
                    color: '#EE4D2D',
                  }}
                >
                  {b}
                </span>
              ))}
            </div>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 mt-auto"
              style={{
                background: 'linear-gradient(135deg,#EE4D2D,#C0392B)',
                color: '#fff',
                boxShadow: '0 6px 24px rgba(238,77,45,0.3)',
              }}
            >
              Ver na Shopee ↗
            </a>
          </div>

          {/* Mercado Livre */}
          <div
            className="rounded-2xl p-8 flex flex-col gap-5"
            style={{
              background: 'rgba(52,131,250,0.04)',
              border: '1px solid rgba(52,131,250,0.2)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <MercadoLivreIcon size={52} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: '1.6rem',
                    letterSpacing: '2px',
                    color: '#3483FA',
                    lineHeight: 1,
                  }}
                >
                  MERCADO LIVRE
                </div>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Loja Oficial Entratta</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span style={{ color: '#EAB308', fontSize: '1rem' }}>★★★★★</span>
              <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>4.9 · +200 vendas</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Mercado Pago', 'Entrega rápida', 'Compra Protegida'].map(b => (
                <span
                  key={b}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(52,131,250,0.08)',
                    border: '1px solid rgba(52,131,250,0.18)',
                    color: '#3483FA',
                  }}
                >
                  {b}
                </span>
              ))}
            </div>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 mt-auto"
              style={{
                background: 'linear-gradient(135deg,#3483FA,#1a6fd4)',
                color: '#fff',
                boxShadow: '0 6px 24px rgba(52,131,250,0.3)',
              }}
            >
              Ver no Mercado Livre ↗
            </a>
          </div>
        </div>

        {/* Trust footer */}
        <div
          className="rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Prefere personalizar ou tem uma medida especial?{' '}
            <strong style={{ color: '#E2E8F0' }}>
              Fale diretamente pelo WhatsApp — orçamento em minutos.
            </strong>
          </p>
          <a
            href={WPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all hover:-translate-y-0.5 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,#22C55E,#15803D)',
              color: '#000',
            }}
          >
            <WhatsAppIcon size={16} />
            Orçamento no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
