import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'
import { Breadcrumb } from '@/components/Breadcrumb'
import { SIZE_FAQ } from '@/lib/constants'
import { SizeQuote } from './SizeQuote'

const title = 'Tamanho de Capacho: Guia de Medidas por Porta | Entratta'
const description =
  'Descubra o tamanho ideal de capacho para sua porta: 60×40, 80×50, 90×60, 120×60, 120×90 ou sob medida por m². Escolha a medida e receba o orçamento com frete no WhatsApp.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/medidas' },
  openGraph: { title, description, url: 'https://entratta.com.br/medidas', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SIZE_FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function MedidasPage() {
  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="bg-surface">
        <section className="px-4 pt-10 pb-8 md:pt-14">
          <div className="max-w-5xl mx-auto">
            <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Guia de medidas' }]} />
            <h1
              className="text-dark"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 6vw, 3.6rem)', lineHeight: 1.1 }}
            >
              Qual o tamanho ideal do seu capacho?
            </h1>
            <p className="mt-4 max-w-2xl text-slate leading-relaxed">
              Escolha a medida pela sua porta, a linha e informe o CEP. O orçamento chega no WhatsApp já com o frete,
              direto de quem fabrica.
            </p>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <SizeQuote />
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-dark mb-6">Dúvidas sobre medidas</h2>
            <dl className="grid gap-5">
              {SIZE_FAQ.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-border bg-white p-5">
                  <dt className="font-bold text-dark">{q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
