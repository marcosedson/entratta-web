import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getCitySegmentCombo,
  getCitySegmentCombosForSegment,
  getCityBySlug,
  getSegmentBySlug,
} from "@/lib/city-segment"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp"

interface Props {
  params: Promise<{ segmento: string; cidade: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segmento, cidade } = await params
  const combo = getCitySegmentCombo(cidade, segmento)

  if (!combo) {
    return { title: "Página não encontrada" }
  }

  const pageUrl = `https://entratta.com.br/capacho-para-${segmento}-em-${cidade}`

  return {
    title: `${combo.title} | Entratta`,
    description: combo.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: combo.title,
      description: combo.description,
      url: pageUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: combo.title,
      description: combo.description,
    },
  }
}

export async function generateStaticParams() {
  const combos = getCitySegmentCombosForSegment("empresa") // Generate for all combos
  // For performance, we'll use dynamic params for less-visited combinations
  // Pre-generate top combinations only
  return combos.slice(0, 70).map((combo) => ({
    segmento: combo.segment.slug,
    cidade: combo.city.slug,
  }))
}

export const dynamicParams = true
export const revalidate = 3600 // 1 hour ISR

function CitySegmentSchemas({
  combo,
}: {
  combo: ReturnType<typeof getCitySegmentCombo>
}) {
  if (!combo) return null

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: combo.title,
    provider: {
      "@type": "LocalBusiness",
      name: "ENTRATTA Capachos Personalizados",
      telephone: "+55-64-99206-6855",
      url: "https://entratta.com.br",
      areaServed: {
        "@type": "City",
        name: combo.city.name,
        addressRegion: combo.city.state,
      },
    },
    description: combo.description,
    areaServed: {
      "@type": "City",
      name: combo.city.name,
      addressRegion: combo.city.state,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://entratta.com.br",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: combo.segment.title,
        item: `https://entratta.com.br/capacho-para-${combo.segment.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `em ${combo.city.name}`,
        item: `https://entratta.com.br/capacho-para-${combo.segment.slug}-em-${combo.city.slug}`,
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Qual o preço de ${combo.segment.name.toLowerCase()} em ${combo.city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `O preço de um capacho personalizado para ${combo.segment.name.toLowerCase()} em ${combo.city.name} varia conforme tamanho, quantidade e personalização. Solicite seu orçamento personalizado via WhatsApp.`,
        },
      },
      {
        "@type": "Question",
        name: `Qual o prazo de entrega em ${combo.city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Produzimos em até 3 dias úteis. ${combo.city.diferencial}`,
        },
      },
      {
        "@type": "Question",
        name: `Como solicitar um ${combo.segment.name.toLowerCase()} em ${combo.city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Envie mensagem no WhatsApp com foto da logo, cores desejadas e tamanho. Você recebe orçamento em menos de 1 hora.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

export default async function CitySegmentPage({ params }: Props) {
  const { segmento, cidade } = await params
  const combo = getCitySegmentCombo(cidade, segmento)

  if (!combo) {
    notFound()
  }

  const whatsappText = encodeURIComponent(
    `Olá! Quero um capacho personalizado para ${combo.segment.name.toLowerCase()} em ${combo.city.name}. Podem me ajudar com um orçamento?`
  )

  return (
    <>
      <CitySegmentSchemas combo={combo} />
      <Header />
      <main className="flex-1">
        <div className="px-4 py-16 md:py-24 max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "#64748B" }}>
            <a href="/" style={{ color: "#22C55E", textDecoration: "none" }}>
              Home
            </a>
            <span>/</span>
            <a
              href={`/capacho-para-${combo.segment.slug}`}
              style={{ color: "#22C55E", textDecoration: "none" }}
            >
              {combo.segment.title}
            </a>
            <span>/</span>
            <span>{combo.city.name}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
            {combo.title}
          </h1>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {combo.description}
          </p>

          <div
            className="bg-green-50 rounded-lg p-6 border border-green-200 mb-12"
            style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.2)" }}
          >
            <p className="text-gray-700 mb-4">
              <strong>Nosso diferencial em {combo.city.name}:</strong> {combo.city.diferencial}
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Por que {combo.segment.name} em {combo.city.name}?
            </h2>
            <p className="text-gray-700 mb-4">
              {combo.segment.description}
            </p>
            <ul className="space-y-3">
              {combo.segment.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-gray-700">
                  <span className="text-green-500 font-bold flex-shrink-0">★</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Casos de Uso em {combo.city.name}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {combo.segment.useCases.map((useCase) => (
                <li key={useCase} className="flex items-start gap-3 text-gray-700">
                  <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Como Funciona
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>Você envia a logo, medidas e cores pelo WhatsApp</li>
              <li>Nossa equipe cria o layout em alta definição</li>
              <li>Você aprova ou solicita ajustes</li>
              <li>Produção em até 3 dias úteis</li>
              <li>Entregamos em {combo.city.name} com rastreamento</li>
            </ol>
          </section>

          <section
            className="bg-green-50 rounded-lg p-8 border border-green-200"
            style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.2)" }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#22C55E" }}>
              Orçamento Personalizado para {combo.city.name}
            </h2>
            <p className="text-gray-700 mb-6">
              Fale diretamente com nossa equipe. Enviamos um orçamento customizado em minutos, sem compromisso.
            </p>
            <a
              href={`https://wa.me/5564992066855?text=${whatsappText}`}
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
