import type { Metadata } from "next"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp"

export const metadata: Metadata = {
  title: "Capacho Personalizado Direto de Fábrica | Entratta Fabricante",
  description:
    "Capacho personalizado com logo direto de fábrica. Fabricante direto, zero intermediários. Orçamento grátis em minutos.",
  alternates: { canonical: "/melhor-preco" },
  openGraph: {
    title: "Direto de Fábrica | Entratta",
    description:
      "Somos fabricante direto — sem intermediários, sem revendedores. Orçamento em minutos.",
    url: "https://entratta.com.br/melhor-preco",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Direto de Fábrica | Entratta",
    description: "Orçamento grátis em minutos, direto de quem fabrica.",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Entratta — Fabricante Direto de Capachos Personalizados",
  description:
    "Fabricante direto de capachos personalizados com logo. Orçamento grátis em minutos.",
  url: "https://entratta.com.br/melhor-preco",
  telephone: "+55-64-99206-6855",
  priceRange: "$",
  sameAs: [
    "https://www.instagram.com/entrattaofficial",
    "https://lista.mercadolivre.com.br/_CustId_3459954476",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Capachos e Tapetes Personalizados",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Capacho Personalizado com Logo",
          description: "Vinil de alta resistência com sua logo ou design exclusivo",
        },
      },
    ],
  },
}

export default function MelhorPrecoPage() {
  const whatsappLink =
    "https://wa.me/5564992066855?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20comprar%20direto%20da%20f%C3%A1brica.%20Pode%20me%20ajudar%20com%20um%20or%C3%A7amento%3F"

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <section
          className="px-4 py-20 md:py-28 text-center"
          style={{
            background: "linear-gradient(180deg,#030810 0%,#060E16 100%)",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6"
              style={{
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#22C55E",
                letterSpacing: "1.5px",
              }}
            >
              FABRICANTE DIRETO
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              Capacho Personalizado <br />
              <span style={{ color: "#4ADE80", fontStyle: "italic" }}>
                Direto da Fábrica
              </span>
            </h1>

            <p
              className="text-lg"
              style={{
                color: "#94A3B8",
                maxWidth: "520px",
                margin: "0 auto 2rem",
              }}
            >
              Somos fabricante direto. Sem intermediários, sem revendedores.{" "}
              <strong style={{ color: "#fff" }}>
                Orçamento grátis em minutos.
              </strong>
            </p>

            <p
              style={{
                color: "#22C55E",
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "3rem",
              }}
            >
              ✓ Sem pedido mínimo — atendemos 1 unidade
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-black text-lg transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#22C55E,#15803D)",
                boxShadow: "0 10px 40px rgba(34,197,94,0.4)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir Orçamento Agora
            </a>
          </div>
        </section>

        <section className="px-4 py-16 md:py-24" style={{ background: "#fff" }}>
          <div className="max-w-4xl mx-auto">
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2.5rem",
                color: "#0F172A",
                textAlign: "center",
                marginBottom: "3rem",
              }}
            >
              Por que comprar direto da fábrica?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                style={{
                  padding: "2rem",
                  borderRadius: "12px",
                  background: "rgba(34,197,94,0.05)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                  }}
                >
                  🏭
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#0F172A",
                    marginBottom: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  Fabricante Direto
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.6, textAlign: "center" }}>
                  Zero intermediários, zero revendedores. Você compra direto de quem fabrica.
                </p>
              </div>

              <div
                style={{
                  padding: "2rem",
                  borderRadius: "12px",
                  background: "rgba(34,197,94,0.05)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                  }}
                >
                  📦
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#0F172A",
                    marginBottom: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  Produção em Série
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.6, textAlign: "center" }}>
                  Volume reduz custo. Maior demanda = preço mais competitivo.
                </p>
              </div>

              <div
                style={{
                  padding: "2rem",
                  borderRadius: "12px",
                  background: "rgba(34,197,94,0.05)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                  }}
                >
                  💬
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#0F172A",
                    marginBottom: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  Modelo Enxuto
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.6, textAlign: "center" }}>
                  Atendimento direto via WhatsApp. Sem showroom caro, sem overhead.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="px-4 py-16 md:py-24"
          style={{
            background: "linear-gradient(135deg, #0F1F38 0%, #1E3A5F 100%)",
          }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2rem",
                color: "#fff",
                marginBottom: "1.5rem",
              }}
            >
              Compra Direta, Sem Intermediário
            </h2>

            <p
              style={{
                color: "#94A3B8",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              Enviamos orçamento grátis em minutos, direto de quem fabrica — sem
              revendedor no meio, sem taxa de intermediação. Você fala com a fábrica,
              não com um vendedor terceirizado.
            </p>

            <div
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "12px",
                padding: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <p style={{ color: "#22C55E", fontWeight: 600, marginBottom: "0.5rem" }}>
                ✓ Orçamento grátis
              </p>
              <p style={{ color: "#22C55E", fontWeight: 600, marginBottom: "0.5rem" }}>
                ✓ Sem compromisso
              </p>
              <p style={{ color: "#22C55E", fontWeight: 600 }}>
                ✓ Fabricante direto, sem intermediário
              </p>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-black text-lg transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#22C55E,#15803D)",
                boxShadow: "0 10px 40px rgba(34,197,94,0.4)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar Mensagem Agora
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
