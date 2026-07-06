import type { Metadata } from "next"
import Link from "next/link"
import { getAllCitySlugs } from "@/lib/data"
import { CITIES_DATA } from "@/lib/data/cities"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp"

export const metadata: Metadata = {
  title: "Cidades Atendidas — Capachos Personalizados em Todo o Brasil | ENTRATTA",
  description: "Entregamos capachos personalizados em 49 cidades do Brasil. Veja a lista completa de cidades atendidas pela ENTRATTA em Goiás, Minas Gerais e outros estados.",
  alternates: {
    canonical: "https://entratta.com.br/atendemos",
  },
  openGraph: {
    title: "Cidades Atendidas — Capachos Personalizados | ENTRATTA",
    description: "Conheça todas as 49 cidades atendidas pela ENTRATTA para capachos personalizados.",
    url: "https://entratta.com.br/atendemos",
    type: "website",
  },
}

function ServeAreasSchemas() {
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
        name: "Cidades Atendidas",
        item: "https://entratta.com.br/atendemos",
      },
    ],
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: CITIES_DATA.map((city, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: city.name,
      url: `https://entratta.com.br/capacho-personalizado-${city.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  )
}

// Agrupar cidades por estado
function groupByState(cities: typeof CITIES_DATA) {
  return cities.reduce(
    (acc, city) => {
      if (!acc[city.state]) {
        acc[city.state] = []
      }
      acc[city.state].push(city)
      return acc
    },
    {} as Record<string, typeof CITIES_DATA>
  )
}

export default function ServeAreasPage() {
  const citiesByState = groupByState(CITIES_DATA)
  const stateOrder = ["GO", "MG", "SP", "MS", "DF", "TO", "PR"]

  return (
    <>
      <ServeAreasSchemas />
      <Header />
      <main className="flex-1">
        <div className="px-4 py-16 md:py-24 max-w-5xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}
          >
            Cidades Atendidas
          </h1>

          <p className="text-lg text-gray-700 mb-12 leading-relaxed">
            Entregamos capachos personalizados em todo o Brasil. Clique em sua cidade para conhecer nossos diferenciais e prazo de entrega.
          </p>

          {/* Destaque: Região de Itumbiara */}
          <section className="mb-16 p-8 rounded-lg bg-green-50 border-2 border-green-200">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "var(--font-heading)", color: "#15803D" }}
            >
              🚀 Região de Itumbiara — Entrega em 1-2 dias úteis
            </h2>
            <p className="text-gray-700 mb-6">
              Somos fabricantes locais em Itumbiara. Se você está nessa região, aproveitamos prazo de entrega reduzido e zero frete de longa distância.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Itumbiara", "Araporã", "Morrinhos", "Goiatuba", "Buriti Alegre", "Centralina"].map(
                (cityName) => {
                  const city = CITIES_DATA.find((c) => c.name === cityName)
                  return city ? (
                    <Link
                      key={city.slug}
                      href={`/capacho-personalizado-${city.slug}`}
                      className="px-4 py-3 rounded-lg font-bold text-green-700 text-center transition hover:bg-green-100"
                      style={{ background: "rgba(34,197,94,0.1)" }}
                    >
                      {city.name}
                    </Link>
                  ) : null
                }
              )}
            </div>
          </section>

          {/* Cidades por Estado */}
          {stateOrder.map((state) => {
            const cities = citiesByState[state]
            if (!cities) return null

            const stateNames: Record<string, string> = {
              GO: "Goiás",
              MG: "Minas Gerais",
              SP: "São Paulo",
              MS: "Mato Grosso do Sul",
              DF: "Distrito Federal",
              TO: "Tocantins",
              PR: "Paraná",
            }

            return (
              <section key={state} className="mb-12">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}
                >
                  {stateNames[state] || state}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/capacho-personalizado-${city.slug}`}
                      className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition"
                    >
                      <h3
                        className="font-bold text-lg mb-2"
                        style={{ color: "#22C55E" }}
                      >
                        {city.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {city.demanda}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Diferencial:</strong> {city.diferencial}
                      </p>
                      {city.nearCities && (
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Próximas:</strong> {city.nearCities}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}

          {/* CTA Final */}
          <section className="mt-16 p-8 rounded-lg bg-green-50 border border-green-200 text-center">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "#22C55E" }}
            >
              Não encontrou sua cidade?
            </h2>
            <p className="text-gray-700 mb-6">
              Entregamos em todo o Brasil. Envie mensagem no WhatsApp para consultar sobre sua região.
            </p>
            <a
              href="https://wa.me/5564992066855?text=Olá! Gostaria de saber se vocês atendem minha cidade."
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#22C55E,#15803D)",
                color: "#fff",
                boxShadow: "0 8px 28px rgba(34,197,94,0.3)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consulte no WhatsApp
            </a>
          </section>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
