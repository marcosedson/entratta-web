import { z } from 'zod'

export const BlogPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  publishedAt: z.date(),
  author: z.string().min(1),
  readingTime: z.number().min(1),
  content: z.string().min(1),
  keywords: z.array(z.string().min(1)),
})

export type BlogPost = z.infer<typeof BlogPostSchema>
