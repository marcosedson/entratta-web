import { CITIES_DATA, type City } from '@/lib/data'
import { FACTORY } from '@/lib/constants'

/** Distância em linha reta (km), fórmula de haversine. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(h)))
}

export function distanceFromFactory(city: City): number {
  return distanceKm(FACTORY, city)
}

export function getNearbyCities(city: City, limit = 6): City[] {
  return CITIES_DATA.filter((c) => c.slug !== city.slug)
    .sort((a, b) => distanceKm(city, a) - distanceKm(city, b))
    .slice(0, limit)
}
