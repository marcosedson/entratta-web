import { z } from 'zod'

export const CitySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  state: z.string().length(2),
  region: z.string().min(1),
  nearCities: z.string().min(1),
  demanda: z.string().min(1),
  diferencial: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
})

export type City = z.infer<typeof CitySchema>
