import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCityBySlug, getAllCitySlugs, CITIES_DATA } from "@/lib/data"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp"
import { Breadcrumb } from "@/components/Breadcrumb"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const city = getCityBySlug(slug) || ({} as any)

  const title = city.name
    ? `Capacho Personalizado em ${city.name}-${city.state} | ENTRATTA Fabricante`
    : "Capacho Personalizado com Logo | Fabricante | Entratta"
  const description = city.name
    ? `Capacho personalizado com logo para empresas e condomínios em ${city.name}. Fabricante direto em Goiás. Entrega rápida. Orçamento grátis no WhatsApp.`
    : "Fabricante de capachos personalizados em vinil com logo da sua empresa. Entrega em 3 dias para todo o Brasil. Orçamento grátis no WhatsApp."

  return {
    title,
    description,
    ...(city.slug && {
      alternates: {
        canonical: `https://entratta.com.br/capacho-personalizado-${city.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://entratta.com.br/capacho-personalizado-${city.slug}`,
        type: "website",
        images: [
          {
            url: `/api/og?city=${encodeURIComponent(city.name)}&state=${city.state}`,
            width: 1200,
            height: 630,
            alt: `Capacho Personalizado em ${city.name}`,
          },
        ],
      },
    }),
  }
}

export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ slug }))
}

export const dynamicParams = true
export const revalidate = 3600

function CitySchema({ city }: { city: (typeof CITIES_DATA)[0] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Capacho Personalizado em ${city.name}`,
    provider: {
      "@type": "LocalBusiness",
      name: "ENTRATTA Capachos Personalizados",
      telephone: "+55-64-99206-6855",
      url: "https://entratta.com.br",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
      addressRegion: city.state,
    },
    description: `Fabricação de capachos personalizados em vinil para ${city.demanda} em ${city.name}, ${city.state}.`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

function ProductSchema({ city }: { city: (typeof CITIES_DATA)[0] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Capacho de Vinil Personalizado com Logo em ${city.name}`,
    description: `Capacho de vinil com logo e texto personalizados, impressão 300 DPI, base antiderrapante — fabricado para ${city.demanda} em ${city.name}, ${city.state}.`,
    brand: {
      "@type": "Brand",
      name: "ENTRATTA",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
      addressRegion: city.state,
    },
    provider: {
      "@type": "LocalBusiness",
      name: "ENTRATTA Capachos Personalizados",
      telephone: "+55-64-99206-6855",
      url: "https://entratta.com.br",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

function FAQSchema({ city }: { city: (typeof CITIES_DATA)[0] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Quanto custa um capacho personalizado em ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `O valor varia conforme tamanho, material e complexidade do design — sem preço fixo, já que cada capacho é personalizado. Solicite um orçamento pelo WhatsApp e receba a resposta em minutos.`,
        },
      },
      {
        "@type": "Question",
        name: `Qual o prazo de entrega para ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Produzimos em até 3 dias úteis. A entrega em ${city.name} depende da localização específica. Consultamos o prazo exato ao fazer o orçamento.`,
        },
      },
      {
        "@type": "Question",
        name: "Quais tamanhos de capacho estão disponíveis?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fazemos capachos sob medida. Desde pequenos (40×60cm) até grandes personalizações industriais. Nenhum pedido é muito pequeno ou grande demais.",
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  const city = getCityBySlug(slug)

  if (!city) {
    notFound()
  }

  return (
    <>
      <CitySchema city={city} />
      <ProductSchema city={city} />
      <FAQSchema city={city} />
      <Header />
      <main className="flex-1">
        <div className="px-4 py-16 md:py-24 max-w-3xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Capacho Personalizado", href: "/como-funciona" },
              { label: city.name },
            ]}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
            Capacho Personalizado em {city.name}, {city.state}
          </h1>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            A ENTRATTA fabrica capachos personalizados em vinil para empresas, condomínios e residências em {city.name} e região.
            Como fabricantes diretos em Itumbiara, {city.diferencial}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Capachos para {city.demanda} em {city.name}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Atendemos {city.name} e as cidades próximas como {city.nearCities}, com produção de capachos vinil antiderrapantes, demarcações industriais
              e tapetes sob medida com identidade visual. Cada projeto é customizado conforme suas necessidades específicas.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Como pedir seu capacho em {city.name}
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>Fale pelo WhatsApp com sua medida e logo</li>
              <li>Receba o layout para aprovação em minutos</li>
              <li>Produção em até 3 dias úteis + entrega em {city.name}</li>
            </ol>
          </section>

          <section className="bg-green-50 rounded-lg p-8 border border-green-200">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#22C55E" }}>
              Orçamento Grátis
            </h2>
            <p className="text-gray-700 mb-6">
              Envie sua logo, metragem e detalhes pelo WhatsApp. Nossa equipe responde em minutos com o orçamento personalizado.
            </p>
            <a
              href={`https://wa.me/5564992066855?text=Olá! Quero um capacho personalizado em ${city.name}. Podem me ajudar com um orçamento?`}
              className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
            >
              Pedir Orçamento no WhatsApp
            </a>
          </section>

          <section className="mt-12 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              <details className="border border-gray-200 rounded-lg p-4">
                <summary className="font-bold cursor-pointer text-gray-800">
                  Quanto custa um capacho personalizado em {city.name}?
                </summary>
                <p className="mt-3 text-gray-700">
                  O valor varia conforme tamanho, material e complexidade do design — sem preço fixo, já que cada capacho é personalizado. Solicite um orçamento pelo WhatsApp e receba a resposta em minutos.
                </p>
              </details>
              <details className="border border-gray-200 rounded-lg p-4">
                <summary className="font-bold cursor-pointer text-gray-800">
                  Qual o prazo de entrega para {city.name}?
                </summary>
                <p className="mt-3 text-gray-700">
                  Produzimos em até 3 dias úteis. A entrega em {city.name} depende da localização específica. Consultamos o prazo exato ao fazer o orçamento.
                </p>
              </details>
              <details className="border border-gray-200 rounded-lg p-4">
                <summary className="font-bold cursor-pointer text-gray-800">
                  Quais tamanhos de capacho estão disponíveis?
                </summary>
                <p className="mt-3 text-gray-700">
                  Fazemos capachos sob medida. Desde pequenos (40×60cm) até grandes personalizações industriais. Nenhum pedido é muito pequeno ou grande demais.
                </p>
              </details>
            </div>
          </section>

          <section className="mt-12 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Por que escolher ENTRATTA?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Fabricante direto em Itumbiara — sem intermediários</span>
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
                <span>Orçamento personalizado via WhatsApp</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Sem pedido mínimo — atendemos 1 unidade</span>
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
