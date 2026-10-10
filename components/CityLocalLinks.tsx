import Link from "next/link"
import type { City } from "@/lib/data"
import { FACTORY } from "@/lib/constants"
import { distanceFromFactory, getNearbyCities } from "@/lib/geo"
import { getCitySegmentCombosForCity, getTopCities } from "@/lib/city-segment"
import { SEGMENTS_DATA, getSegmentUrl } from "@/lib/segments"

const headingStyle = { fontFamily: "var(--font-heading)" }
const linkClass = "block rounded-lg border border-gray-200 px-4 py-3 text-gray-800 hover:border-green-500 hover:text-green-700"

export function CityLocalLinks({ city }: { city: City }) {
  const km = distanceFromFactory(city)
  const isTopCity = getTopCities().some((c) => c.slug === city.slug)
  const segmentLinks = isTopCity
    ? getCitySegmentCombosForCity(city.slug).map((c) => ({ href: `/${c.slug}`, label: `${c.segment.name} em ${city.name}` }))
    : SEGMENTS_DATA.slice(0, 8).map((s) => ({ href: getSegmentUrl(s.slug), label: `Capacho para ${s.name.toLowerCase()}` }))

  return (
    <>
      <section className="mt-12 pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-4" style={headingStyle}>
          Da fábrica até {city.name}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          {km < 15
            ? `Nossa fábrica fica em ${FACTORY.city}: você pode retirar o capacho pessoalmente ou receber no endereço.`
            : `${city.name} fica a cerca de ${km} km (em linha reta) da nossa fábrica em ${FACTORY.city}-${FACTORY.state}. Produzimos aqui e enviamos direto, sem revenda no meio.`}
        </p>
        <address className="not-italic text-gray-700">
          <strong>ENTRATTA Capachos Personalizados</strong>
          <br />
          {FACTORY.street}
          <br />
          {FACTORY.postalCode} — {FACTORY.city}, {FACTORY.state}
          <br />
          {FACTORY.phoneDisplay} · {FACTORY.hours}
        </address>
      </section>

      <section className="mt-12 pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6" style={headingStyle}>
          Capacho personalizado por segmento{isTopCity ? ` em ${city.name}` : ""}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {segmentLinks.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass}>
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6" style={headingStyle}>
          Cidades próximas de {city.name}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {getNearbyCities(city).map((c) => (
            <Link key={c.slug} href={`/capacho-personalizado-${c.slug}`} className={linkClass}>
              {c.name}-{c.state}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
