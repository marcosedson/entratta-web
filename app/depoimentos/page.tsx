import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Testimonials } from '@/components/Testimonials'
import { UseCases } from '@/components/UseCases'
import { CTAFinal } from '@/components/CTAFinal'
import { Footer } from '@/components/Footer'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'

export const metadata: Metadata = {
  title: 'Depoimentos | Entratta — Capachos Personalizados',
  description:
    'Veja o que nossos clientes dizem sobre os capachos e tapetes de vinil da Entratta. Empresas e residências de todo o Brasil.',
  alternates: { canonical: '/depoimentos' },
}

export default function DepoimentosPage() {
  return (
    <>
      <Header />
      <main>
        <section
          className="px-4 pt-20 pb-12 text-center"
          style={{ background: 'linear-gradient(180deg,#030810 0%,#060E16 100%)' }}
        >
          <div className="max-w-3xl mx-auto">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
                color: '#22C55E',
                letterSpacing: '1.5px',
              }}
            >
              +500 PEDIDOS ENTREGUES
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                color: '#fff',
                letterSpacing: 0,
                lineHeight: 1.1,
              }}
            >
              Quem escolheu a Entratta{' '}
              <span style={{ color: '#4ADE80', fontStyle: 'italic' }}>não volta atrás</span>
            </h1>
            <p className="mt-4" style={{ color: '#94A3B8', lineHeight: 1.7 }}>
              Clínicas, academias, escritórios e lares — veja como a primeira impressão
              começou a fazer diferença para quem confiou na gente.
            </p>
          </div>
        </section>
        <Testimonials />
        <UseCases />
        <CTAFinal />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
