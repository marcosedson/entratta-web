import type { Metadata } from 'next'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { CTAFinal } from '@/components/CTAFinal'
import { Footer } from '@/components/Footer'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'

const ML_URL = 'https://lista.mercadolivre.com.br/_CustId_3459954476'
const SHOPEE_URL = 'https://shopee.com.br/entrattatapetespersonalizados'
const WPP_URL = 'https://wa.me/5564992066855'

export const metadata: Metadata = {
  title: 'Lojas Oficiais Mercado Livre e Shopee | Entratta — Capachos Personalizados',
  description:
    'Compre capachos e tapetes de vinil personalizados da Entratta no Mercado Livre e na Shopee. Parcelamento, compra protegida e entrega rastreada em todo o Brasil.',
  alternates: { canonical: '/lojas' },
  openGraph: {
    title: 'Nossas Lojas Oficiais | Entratta',
    description:
      'Capachos personalizados com parcelamento, compra protegida e entrega rastreada — no Mercado Livre e na Shopee.',
    url: 'https://entratta.com.br/lojas',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nossas Lojas Oficiais | Entratta',
    description:
      'Parcelamento, compra protegida, entrega rastreada. Qualidade Entratta com segurança de marketplace.',
  },
}

export default function LojasPage() {
  return (
    <>
      <Header />
      <main>
        <section
          className="px-4 pt-20 pb-16"
          style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #FFFFFF 50%, #F8FAFC 100%)' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
                color: '#22C55E',
                letterSpacing: '1.5px',
              }}
            >
              LOJA OFICIAL
            </span>
            <h1
              className="mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                color: '#0F172A',
                lineHeight: 1.1,
              }}
            >
              Compre com{' '}
              <span style={{ color: '#16A34A', fontStyle: 'italic' }}>segurança nas nossas lojas oficiais</span>
            </h1>
            <p style={{ color: '#475569', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
              Parcelamento em até 12x, proteção de compra e entrega rastreada — com a qualidade Entratta.
            </p>
          </div>
        </section>

        <section className="px-4 py-16" style={{ background: '#FFFFFF' }}>
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl p-8 flex flex-col gap-6"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center gap-5">
                <Image
                  src="/mercado-livre.jpg"
                  alt="Mercado Livre"
                  width={64}
                  height={64}
                  style={{ borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: '1.5rem',
                      letterSpacing: '2px',
                      color: '#3483FA',
                      lineHeight: 1,
                    }}
                  >
                    MERCADO LIVRE
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '4px' }}>
                    Loja Oficial Entratta
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span style={{ color: '#EAB308', fontSize: '1rem' }}>★★★★★</span>
                <span style={{ color: '#64748B', fontSize: '0.82rem' }}>4.9 · +500 vendas</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Mercado Pago', 'Parcele em até 12x', 'Entrega rastreada', 'Compra Protegida'].map(b => (
                  <span
                    key={b}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(52,131,250,0.07)',
                      border: '1px solid rgba(52,131,250,0.18)',
                      color: '#3483FA',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>

              <a
                href={ML_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg,#3483FA,#1a6fd4)',
                  color: '#fff',
                  boxShadow: '0 8px 28px rgba(52,131,250,0.3)',
                }}
              >
                Ver produtos no Mercado Livre ↗
              </a>
            </div>

            <div
              className="rounded-2xl p-8 flex flex-col gap-6 mt-6"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center gap-5">
                <Image
                  src="/shopee.png"
                  alt="Shopee"
                  width={64}
                  height={64}
                  style={{ borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: '1.5rem',
                      letterSpacing: '2px',
                      color: '#EE4D2D',
                      lineHeight: 1,
                    }}
                  >
                    SHOPEE
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '4px' }}>
                    Loja Oficial Entratta
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['ShopeePay', 'Parcelamento', 'Entrega rastreada', 'Garantia Shopee'].map(b => (
                  <span
                    key={b}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(238,77,45,0.07)',
                      border: '1px solid rgba(238,77,45,0.18)',
                      color: '#EE4D2D',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>

              <a
                href={SHOPEE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg,#EE4D2D,#C73D1F)',
                  color: '#fff',
                  boxShadow: '0 8px 28px rgba(238,77,45,0.3)',
                }}
              >
                Ver produtos na Shopee ↗
              </a>
            </div>

            <div
              className="mt-6 rounded-2xl px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            >
              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Precisa de <strong style={{ color: '#0F172A' }}>medida especial ou arte personalizada?</strong>{' '}
                Fale diretamente pelo WhatsApp — orçamento em minutos.
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        <CTAFinal />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
