import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { HowItWorks } from '@/components/HowItWorks'
import { Benefits } from '@/components/Benefits'
import { FAQ } from '@/components/FAQ'
import { CTAFinal } from '@/components/CTAFinal'
import { Footer } from '@/components/Footer'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'

export const metadata: Metadata = {
  title: 'Como Pedir Seu Capacho Personalizado em 3 Passos | Entratta',
  description:
    'Configure online, confirme pelo WhatsApp e receba em casa — sem loja física, sem intermediário. Veja o passo a passo completo do pedido ao capacho pronto.',
  alternates: { canonical: '/como-funciona' },
  openGraph: {
    title: 'Como Pedir Seu Capacho Personalizado em 3 Passos | Entratta',
    description:
      'Configure online, confirme pelo WhatsApp, receba em casa. Sem loja física, sem intermediário.',
    url: 'https://entratta.com.br/como-funciona',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Como Pedir Seu Capacho Personalizado em 3 Passos | Entratta',
    description:
      'Configure online, confirme pelo WhatsApp, receba em casa. Sem loja física, sem intermediário.',
  },
}

export default function ComoFuncionaPage() {
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
              PROCESSO SIMPLES
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
              Do pedido ao{' '}
              <span style={{ color: '#4ADE80', fontStyle: 'italic' }}>capacho na sua porta</span>
            </h1>
            <p className="mt-4" style={{ color: '#94A3B8', lineHeight: 1.7 }}>
              Três passos, sete dias úteis — da sua ideia ao produto acabado entregue em todo o Brasil.
            </p>
          </div>
        </section>
        <HowItWorks />
        <Benefits />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
