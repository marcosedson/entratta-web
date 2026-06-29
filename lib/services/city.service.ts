import { City } from '@/lib/types'
import { CityRepository } from '@/lib/repositories'

export class CityService {
  static getBySlug(slug: string): City | undefined {
    return CityRepository.getBySlug(slug)
  }

  static getAll(): City[] {
    return CityRepository.getAll()
  }

  static getAllSlugs(): string[] {
    return CityRepository.getAllSlugs()
  }

  static getByState(state: string): City[] {
    return CityRepository.getByState(state)
  }

  static getByRegion(region: string): City[] {
    return CityRepository.getByRegion(region)
  }

  static getTotal(): number {
    return this.getAll().length
  }

  static getStates(): string[] {
    const states = new Set(this.getAll().map((c) => c.state))
    return Array.from(states).sort()
  }

  static getRegions(): string[] {
    const regions = new Set(this.getAll().map((c) => c.region))
    return Array.from(regions).sort()
  }

  static search(query: string): City[] {
    const q = query.toLowerCase()
    return this.getAll().filter(
      (city) =>
        city.name.toLowerCase().includes(q) ||
        city.region.toLowerCase().includes(q) ||
        city.state.toLowerCase().includes(q)
    )
  }

  static getNearby(slug: string): City[] {
    const city = this.getBySlug(slug)
    if (!city || !city.nearCities) return []

    const nearCityNames = city.nearCities.split(',').map((n) => n.trim())
    return this.getAll().filter((c) =>
      nearCityNames.some((name) => c.name.includes(name))
    )
  }
}
