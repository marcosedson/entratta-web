import { z } from 'zod'

export const ConfiguratorStateSchema = z.object({
  medida: z.string().min(1),
  corTapete: z.string().min(1),
  corTexto: z.string().min(1),
  corBorda: z.string().min(1),
  texto: z.string(),
  borda: z.string().min(1),
  fonte: z.string().min(1),
  logoSrc: z.string().nullable(),
  customL: z.string(),
  customC: z.string(),
  nome: z.string(),
  wpp: z.string(),
  logoRotacao: z.number(),
  logoX: z.number().nullable(),
  logoY: z.number().nullable(),
  logoScale: z.number().min(0.3).max(1.9),
  textoX: z.number().nullable(),
  textoY: z.number().nullable(),
})

export type ConfiguratorState = z.infer<typeof ConfiguratorStateSchema>
