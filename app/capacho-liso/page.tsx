import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'
import { Breadcrumb } from '@/components/Breadcrumb'
import { TrackedWhatsAppLink } from '@/components/TrackedWhatsAppLink'
import { CARPET_COLORS, SIZE_GUIDE, LISO_USES, LISO_FAQ, LISO_WHATSAPP_MESSAGE } from '@/lib/constants'
import { SEOService } from '@/lib/services/seo.service'

const title = 'Capacho Liso de Vinil em Cor Sólida, Direto da Fábrica | Entratta'
const description =
  'Capacho liso de vinil em cor sólida: preto, cinza, verde, azul e mais. Medidas de 60×40 a 120×90 cm ou sob medida por m². Orçamento com frete pelo WhatsApp.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/capacho-liso' },
  openGraph: { title, description, url: 'https://entratta.com.br/capacho-liso', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

const faqSchema = SEOService.buildFaqSchema(LISO_FAQ)

const primaryCta =
  'inline-flex items-center justify-center rounded-xl bg-brand-solid px-7 py-4 text-sm font-bold text-white hover:bg-brand-dark'
const secondaryCta =
  'inline-flex items-center justify-center rounded-xl border border-border bg-white px-7 py-4 text-sm font-bold text-dark hover:border-brand-solid'

export default function CapachoLisoPage() {
  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="bg-surface">
        <section className="px-4 pt-10 pb-12 md:pt-14">
          <div className="max-w-5xl mx-auto">
            <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Capacho liso' }]} />
            <h1
              className="text-dark"
              style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 6vw, 3.6rem)', lineHeight: 1.1 }}
            >
              Capacho liso de vinil, em cor sólida
            </h1>
            <p className="mt-4 max-w-2xl text-slate leading-relaxed">
              Para quem quer uma entrada limpa, sem texto nem desenho. Vinil de alta resistência com base
              antiderrapante, fabricado por nós e enviado para todo o Brasil.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedWhatsAppLink source="capacho_liso_hero" message={LISO_WHATSAPP_MESSAGE} className={primaryCta}>
                Pedir orçamento no WhatsApp
              </TrackedWhatsAppLink>
              <Link href="/medidas" className={secondaryCta}>
                Ver guia de medidas
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14">
          <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-xl font-bold text-dark">Cores</h2>
              <ul className="mt-5 grid grid-cols-4 gap-4 sm:grid-cols-7 md:grid-cols-4">
                {CARPET_COLORS.map((c) => (
                  <li key={c.id} className="flex flex-col items-center gap-2">
                    <span className="h-12 w-12 rounded-lg border border-border" style={{ background: c.hex }} aria-hidden="true" />
                    <span className="text-xs text-slate">{c.label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-slate">Disponibilidade de cada cor confirmada no atendimento.</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-xl font-bold text-dark">Medidas</h2>
              <ul className="mt-5 grid gap-2">
                {SIZE_GUIDE.map((s) => (
                  <li key={s.id} className="flex items-baseline justify-between gap-4 border-b border-border pb-2 text-sm">
                    <span className="font-bold text-dark">{s.label}</span>
                    <span className="text-right text-xs text-slate">{s.fitsDoor}</span>
                  </li>
                ))}
                <li className="pt-1 text-sm font-bold text-dark">Sob medida, calculado por m²</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-dark mb-6">Onde o capacho liso funciona melhor</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {LISO_USES.map((u) => (
                <li key={u.title} className="rounded-xl border border-border bg-white p-5">
                  <h3 className="font-bold text-dark">{u.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{u.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate">
              Quer nome, frase ou logo?{' '}
              <Link href="/#produtos" className="font-semibold text-brand-dark underline">
                Veja o capacho personalizado
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-dark mb-6">Perguntas frequentes</h2>
            <dl className="grid gap-5">
              {LISO_FAQ.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-border bg-white p-5">
                  <dt className="font-bold text-dark">{q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate">{a}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 text-center">
              <TrackedWhatsAppLink source="capacho_liso_faq" message={LISO_WHATSAPP_MESSAGE} className={primaryCta}>
                Pedir orçamento com frete
              </TrackedWhatsAppLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
