import { Segment } from '@/lib/types'
import { SEGMENTS_DATA } from '@/lib/data/segments'

export class SegmentRepository {
  static getBySlug(slug: string): Segment | undefined {
    return SEGMENTS_DATA.find((segment) => segment.slug === slug)
  }

  static getAllSlugs(): string[] {
    return SEGMENTS_DATA.map((segment) => segment.slug)
  }

  static getAll(): Segment[] {
    return SEGMENTS_DATA
  }
}

// Backwards compatibility (used in dynamic routes)
export function getSegmentBySlug(slug: string): Segment | undefined {
  return SegmentRepository.getBySlug(slug)
}

export function getAllSegmentSlugs(): string[] {
  return SegmentRepository.getAllSlugs()
}

export function getSegmentUrl(slug: string): string {
  return `/capacho-para-${slug}`
}
