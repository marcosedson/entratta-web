import { City } from '@/lib/types'
import { CITIES_DATA } from '@/lib/data/cities'

export class CityRepository {
  static getBySlug(slug: string): City | undefined {
    return CITIES_DATA.find((city) => city.slug === slug)
  }

  static getAllSlugs(): string[] {
    return CITIES_DATA.map((city) => city.slug)
  }

  static getAll(): City[] {
    return CITIES_DATA
  }

  static getByState(state: string): City[] {
    return CITIES_DATA.filter((city) => city.state === state)
  }

  static getByRegion(region: string): City[] {
    return CITIES_DATA.filter((city) => city.region === region)
  }
}

// Backwards compatibility (used in dynamic routes)
export function getCityBySlug(slug: string): City | undefined {
  return CityRepository.getBySlug(slug)
}

export function getAllCitySlugs(): string[] {
  return CityRepository.getAllSlugs()
}
