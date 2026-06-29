import { BlogPost } from '@/lib/types'
import { BLOG_POSTS } from '@/lib/blog/data'

export class BlogService {
  static getBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find((post) => post.slug === slug)
  }

  static getAll(): BlogPost[] {
    return BLOG_POSTS.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    )
  }

  static getAllSlugs(): string[] {
    return BLOG_POSTS.map((post) => post.slug)
  }

  static getByCategory(category: string): BlogPost[] {
    return BLOG_POSTS.filter((post) => post.category === category).sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    )
  }

  static getRelated(slug: string, limit: number = 3): BlogPost[] {
    const post = this.getBySlug(slug)
    if (!post) return []

    return this.getAll()
      .filter((p) => p.slug !== slug && p.category === post.category)
      .slice(0, limit)
  }

  static getRecent(limit: number = 5): BlogPost[] {
    return this.getAll().slice(0, limit)
  }

  static estimateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }
}
