import { CITIES_DATA, type City } from "./data"
import { SEGMENTS_DATA, type Segment } from "./segments"

export interface CitySegmentCombo {
  city: City
  segment: Segment
  title: string
  description: string
  slug: string
}

// Top 10 largest cities by population for Entratta coverage
const TOP_CITIES = [
  "goiania",
  "aparecida-de-goiania",
  "anapolis",
  "rio-verde",
  "uberlandia",
  "araguari",
  "itumbiara",
  "senador-canedo",
  "caldas-novas",
  "morrinhos",
]

export function getTopCities(): City[] {
  return CITIES_DATA.filter((city) => TOP_CITIES.includes(city.slug))
}

export function getCityBySlug(slug: string): City | undefined {
  return CITIES_DATA.find((city) => city.slug === slug)
}

export function getSegmentBySlug(slug: string): Segment | undefined {
  return SEGMENTS_DATA.find((segment) => segment.slug === slug)
}

export function generateCitySegmentCombo(
  city: City,
  segment: Segment
): CitySegmentCombo {
  const title = `Capacho Personalizado para ${segment.name} em ${city.name}`
  const description = `${segment.description} Entrega rápida em ${city.name}, ${city.state}. Orçamento personalizado via WhatsApp.`

  return {
    city,
    segment,
    title,
    description,
    slug: `capacho-para-${segment.slug}-em-${city.slug}`,
  }
}

export function getAllCitySegmentCombos(): CitySegmentCombo[] {
  const combos: CitySegmentCombo[] = []

  for (const city of getTopCities()) {
    for (const segment of SEGMENTS_DATA) {
      combos.push(generateCitySegmentCombo(city, segment))
    }
  }

  return combos
}

export function getCitySegmentCombo(
  citySlug: string,
  segmentSlug: string
): CitySegmentCombo | undefined {
  const city = getCityBySlug(citySlug)
  const segment = getSegmentBySlug(segmentSlug)

  if (!city || !segment) return undefined

  return generateCitySegmentCombo(city, segment)
}

export function getCitySegmentCombosForCity(citySlug: string): CitySegmentCombo[] {
  const city = getCityBySlug(citySlug)
  if (!city) return []

  return SEGMENTS_DATA.map((segment) => generateCitySegmentCombo(city, segment))
}

export function getCitySegmentCombosForSegment(
  segmentSlug: string
): CitySegmentCombo[] {
  const segment = getSegmentBySlug(segmentSlug)
  if (!segment) return []

  return getTopCities().map((city) => generateCitySegmentCombo(city, segment))
}
