import { Metadata } from "next"
import { getSegmentBySlug, getAllSegmentSlugs, segments } from "@/lib/segments"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const segment = getSegmentBySlug(slug)

  if (!segment) {
    return { title: "Página não encontrada" }
  }

  const title = `${segment.title} | Fabricante | ENTRATTA`
  const description = `${segment.description} Fabricante direto em Goiás. Entrega rápida. Orçamento grátis no WhatsApp.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://entratta.com.br/capacho-para-${segment.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://entratta.com.br/capacho-para-${segment.slug}`,
      type: "website",
    },
  }
}

export async function generateStaticParams() {
  return getAllSegmentSlugs().map((slug) => ({ slug }))
}

export const revalidate = false

function SegmentSchema({ segment }: { segment: typeof segments[0] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: segment.title,
    provider: {
      "@type": "Organization",
      name: "ENTRATTA Capachos Personalizados",
      telephone: "+55-64-99206-6855",
      url: "https://entratta.com.br",
    },
    description: segment.description,
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function SegmentPage({ params }: Props) {
  const { slug } = await params
  const segment = getSegmentBySlug(slug)

  if (!segment) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="px-4 py-20 max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Página não encontrada</h1>
            <p className="text-gray-600">O segmento que você procura não está disponível.</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SegmentSchema segment={segment} />
      <Header />
      <main className="flex-1">
        <div className="px-4 py-16 md:py-24 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
            {segment.title}
          </h1>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {segment.description} {segment.diferencial}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Casos de Uso
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {segment.useCases.map((useCase) => (
                <li key={useCase} className="flex items-start gap-3 text-gray-700">
                  <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Benefícios dos Capachos ENTRATTA
            </h2>
            <ul className="space-y-3">
              {segment.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-gray-700">
                  <span className="text-green-500 font-bold flex-shrink-0">★</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Nosso Processo
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>Você envia a logo, medidas e cores pelo WhatsApp</li>
              <li>Nossa equipe cria o layout em alta definição</li>
              <li>Você aprova ou solicita ajustes</li>
              <li>Produção em até 3 dias úteis</li>
              <li>Entregamos em todo o Brasil com rastreamento</li>
            </ol>
          </section>

          <section className="bg-green-50 rounded-lg p-8 border border-green-200">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#22C55E" }}>
              Orçamento Personalizado
            </h2>
            <p className="text-gray-700 mb-6">
              Fale diretamente com nossa equipe. Enviamos um orçamento customizado em minutos, sem compromisso.
            </p>
            <a
              href={`https://wa.me/5564992066855?text=Olá! Quero um capacho personalizado para ${segment.name}. Podem me ajudar com um orçamento?`}
              className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
            >
              Solicitar Orçamento no WhatsApp
            </a>
          </section>

          <section className="mt-12 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Por que Escolher ENTRATTA?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Fabricante direto — preço de fábrica sem intermediários</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Vinil de alta resistência com impressão 300 DPI</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Produção em até 3 dias úteis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Experiência em múltiplos segmentos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Suporte personalizado via WhatsApp</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
