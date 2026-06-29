import { z } from 'zod'

export const SegmentSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  useCases: z.array(z.string().min(1)),
  benefits: z.array(z.string().min(1)),
  diferencial: z.string().min(1),
})

export type Segment = z.infer<typeof SegmentSchema>
