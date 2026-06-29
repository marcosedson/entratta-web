import { BlogPost } from '@/lib/types'
import { BLOG_POSTS } from './data'

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug)
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  )
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.category === category).sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  )
}
