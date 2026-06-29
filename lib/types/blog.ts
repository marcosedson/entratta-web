export interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
  publishedAt: Date
  author: string
  readingTime: number
  content: string
  keywords: string[]
}
