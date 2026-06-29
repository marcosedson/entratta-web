import { z } from 'zod'

export const MeasurementSchema = z.object({
  l: z.string().min(1),
  w: z.number().min(0),
  c: z.number().min(0),
})

export type Measurement = z.infer<typeof MeasurementSchema>
