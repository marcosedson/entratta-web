import type { Metadata } from "next"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp"

export const metadata: Metadata = {
  title: "Fale com a ENTRATTA — Capachos Personalizados",
  description: "Entre em contato com a ENTRATTA para solicitar orçamento de capachos personalizados. Endereço físico em Itumbiara, GO. Atendimento via WhatsApp.",
  alternates: {
    canonical: "https://entratta.com.br/contato",
  },
  openGraph: {
    title: "Contato ENTRATTA — Capachos Personalizados",
    description: "Entre em contato com a ENTRATTA para solicitar orçamento de capachos personalizados.",
    url: "https://entratta.com.br/contato",
    type: "website",
  },
}

function ContactSchemas() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@id": "https://entratta.com.br/#local-business-contact",
    "@type": "LocalBusiness",
    name: "ENTRATTA Capachos Personalizados",
    description: "Fabricante de capachos personalizados em vinil.",
    url: "https://entratta.com.br",
    telephone: "+55-64-99206-6855",
    image: "https://entratta.com.br/opengraph-image.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "R. Urupema, Nº 236 - Planalto",
      addressLocality: "Itumbiara",
      addressRegion: "GO",
      postalCode: "75533-130",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -18.4186,
      longitude: -49.2155,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
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
        name: "Contato",
        item: "https://entratta.com.br/contato",
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}

export default function ContactPage() {
  return (
    <>
      <ContactSchemas />
      <Header />
      <main className="flex-1">
        <div className="px-4 py-16 md:py-24 max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold mb-8"
            style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}
          >
            Fale com a ENTRATTA
          </h1>

          <p className="text-lg text-gray-700 mb-12 leading-relaxed">
            Fabricante de capachos personalizados em vinil. Estamos aqui para ajudar com seu orçamento.
          </p>

          {/* Endereço Físico */}
          <section className="mb-16">
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}
            >
              Nossa Localização
            </h2>

            <div className="bg-green-50 rounded-lg p-8 border border-green-200 mb-8">
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#22C55E" }}
              >
                Endereço Físico
              </h3>
              <p className="text-gray-700 text-lg mb-2">
                <strong>ENTRATTA Capachos Personalizados</strong>
              </p>
              <p className="text-gray-700 mb-1">
                R. Urupema, Nº 236 - Planalto
              </p>
              <p className="text-gray-700 mb-4">
                75533-130 — Itumbiara, GO
              </p>

              <h3
                className="text-lg font-bold mt-6 mb-3"
                style={{ color: "#22C55E" }}
              >
                Horário de Funcionamento
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>Segunda a Sexta:</strong> 08h às 18h
              </p>
              <p className="text-gray-700">
                <strong>Telefone:</strong> (64) 99206-6855
              </p>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-lg overflow-hidden mb-8 border border-gray-200">
              <iframe
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen={true}
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.1628649267296!2d-49.21547622349122!3d-18.418586271234286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94bc849b56b5c5cd%3A0xa56b56b56b56b56b!2sR.%20Urupema%2C%20236%20-%20Planalto%2C%20Itumbiara%20-%20GO%2C%2075533-130!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              ></iframe>
            </div>
          </section>

          {/* WhatsApp CTA */}
          <section className="mb-16">
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}
            >
              Solicite seu Orçamento
            </h2>

            <p className="text-gray-700 mb-8">
              A forma mais rápida de obter seu orçamento é via WhatsApp. Nossa equipe responde em minutos.
            </p>

            <a
              href="https://wa.me/5564992066855?text=Olá! Gostaria de solicitar um orçamento para capacho personalizado."
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#22C55E,#15803D)",
                color: "#fff",
                boxShadow: "0 8px 28px rgba(34,197,94,0.3)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Abrir WhatsApp
            </a>
          </section>

          {/* FAQ */}
          <section>
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}
            >
              Perguntas Frequentes
            </h2>

            <div className="space-y-4">
              <details
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
                style={{ background: "#f9fafb" }}
              >
                <summary
                  className="font-bold text-gray-800 flex items-center justify-between"
                  style={{ userSelect: "none" }}
                >
                  <span>Qual é o horário de atendimento?</span>
                  <span style={{ color: "#22C55E", marginLeft: "1rem" }}>+</span>
                </summary>
                <p className="text-gray-700 mt-3">
                  Atendemos de segunda a sexta, das 08h às 18h. Você pode enviar mensagens pelo WhatsApp a qualquer hora que responderemos assim que possível.
                </p>
              </details>

              <details
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
                style={{ background: "#f9fafb" }}
              >
                <summary
                  className="font-bold text-gray-800 flex items-center justify-between"
                  style={{ userSelect: "none" }}
                >
                  <span>Como obtenho um orçamento?</span>
                  <span style={{ color: "#22C55E", marginLeft: "1rem" }}>+</span>
                </summary>
                <p className="text-gray-700 mt-3">
                  Envie uma mensagem no WhatsApp com a foto da sua logo, cores desejadas e tamanho do capacho. Nossa equipe fará um orçamento personalizado em menos de 1 hora.
                </p>
              </details>

              <details
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
                style={{ background: "#f9fafb" }}
              >
                <summary
                  className="font-bold text-gray-800 flex items-center justify-between"
                  style={{ userSelect: "none" }}
                >
                  <span>Qual é o prazo de entrega?</span>
                  <span style={{ color: "#22C55E", marginLeft: "1rem" }}>+</span>
                </summary>
                <p className="text-gray-700 mt-3">
                  Produzimos em até 3 dias úteis. O prazo de entrega varia conforme a localidade, mas garantimos rastreamento de toda encomenda.
                </p>
              </details>

              <details
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
                style={{ background: "#f9fafb" }}
              >
                <summary
                  className="font-bold text-gray-800 flex items-center justify-between"
                  style={{ userSelect: "none" }}
                >
                  <span>Vocês aceitam visitas na fábrica?</span>
                  <span style={{ color: "#22C55E", marginLeft: "1rem" }}>+</span>
                </summary>
                <p className="text-gray-700 mt-3">
                  Sim! Se você quiser visitar nossa fábrica em Itumbiara, entre em contato pelo WhatsApp para agendar sua visita.
                </p>
              </details>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
