import Link from "next/link"
import { cities } from "@/lib/cities"

export function CitiesLinks() {
  return (
    <section className="px-4 py-16 md:py-24" style={{ background: "#F8FAFC" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}
          >
            Capachos Personalizados em{" "}
            <span style={{ color: "#22C55E", fontStyle: "italic" }}>Itumbiara e Região</span>
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Somos fabricantes em Itumbiara, GO, e atendemos com entrega rápida toda a região: Araporã,
            Morrinhos, Goiatuba, Centralina e Caldas Novas. Para o restante do Brasil, produção em 3
            dias úteis e envio SEDEX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/capacho-personalizado-${city.slug}`}
              className="p-5 rounded-lg border border-gray-200 bg-white hover:border-green-400 hover:shadow-md transition"
            >
              <h3 className="font-bold text-gray-800 mb-1">
                Capacho em {city.name}
              </h3>
              <p className="text-sm text-gray-600">{city.region}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
