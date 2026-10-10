import Link from "next/link"
import { getCitySegmentCombosForSegment } from "@/lib/city-segment"

const linkClass = "block rounded-lg border border-gray-200 px-4 py-3 text-gray-800 hover:border-green-500 hover:text-green-700"

export function SegmentCityLinks({ segmentSlug, segmentName }: { segmentSlug: string; segmentName: string }) {
  const combos = getCitySegmentCombosForSegment(segmentSlug)
  if (combos.length === 0) return null

  return (
    <section className="mt-12 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
        Capacho para {segmentName.toLowerCase()} por cidade
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {combos.map((c) => (
          <Link key={c.slug} href={`/${c.slug}`} className={linkClass}>
            {c.city.name}-{c.city.state}
          </Link>
        ))}
      </div>
    </section>
  )
}
