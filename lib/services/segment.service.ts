import { Segment } from '@/lib/types'
import { SegmentRepository } from '@/lib/repositories'

export class SegmentService {
  static getBySlug(slug: string): Segment | undefined {
    return SegmentRepository.getBySlug(slug)
  }

  static getAll(): Segment[] {
    return SegmentRepository.getAll()
  }

  static getAllSlugs(): string[] {
    return SegmentRepository.getAllSlugs()
  }

  static getTotal(): number {
    return this.getAll().length
  }

  static search(query: string): Segment[] {
    const q = query.toLowerCase()
    return this.getAll().filter(
      (segment) =>
        segment.name.toLowerCase().includes(q) ||
        segment.title.toLowerCase().includes(q) ||
        segment.description.toLowerCase().includes(q) ||
        segment.useCases.some((uc) => uc.toLowerCase().includes(q))
    )
  }

  static getByUseCase(useCase: string): Segment[] {
    return this.getAll().filter((segment) =>
      segment.useCases.some((uc) =>
        uc.toLowerCase().includes(useCase.toLowerCase())
      )
    )
  }

  static getAllUseCases(): string[] {
    const useCases = new Set<string>()
    this.getAll().forEach((segment) => {
      segment.useCases.forEach((uc) => useCases.add(uc))
    })
    return Array.from(useCases)
  }

  static getUrl(slug: string): string {
    return `/capacho-para-${slug}`
  }
}
