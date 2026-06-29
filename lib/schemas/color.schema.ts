import { z } from 'zod'

export const ColorSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})

export type Color = z.infer<typeof ColorSchema>
