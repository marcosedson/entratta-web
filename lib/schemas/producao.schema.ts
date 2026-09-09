import { z } from 'zod'

import { ACI_CODES } from '@/lib/constants/aci-palette'

/**
 * Contrato do serviço de produção (espelho de services/production/app/schemas.py).
 * Validado na borda Next.js antes do proxy.
 */

// Limite generoso da mesa; ajustar quando a produção confirmar o curso real da CNC.
export const MAX_MESA_MM = { largura: 2000, altura: 3000 } as const

const aciSchema = z
  .number()
  .int()
  .refine((v) => (ACI_CODES as number[]).includes(v), {
    message: `Cor ACI fora da paleta (${ACI_CODES.join(', ')})`,
  })

const pontoSchema = z.tuple([z.number(), z.number()])

export const PoligonoRegiaoSchema = z.object({
  externo: z.array(pontoSchema).min(3),
  furos: z.array(z.array(pontoSchema)).default([]),
})

export const RegiaoLogoSchema = z.object({
  aci: aciSchema,
  poligonos: z.array(PoligonoRegiaoSchema).min(1),
})

export const LogoDesignSchema = z.object({
  x: z.number(),
  y: z.number(),
  scale: z.number().positive().default(1),
  rotacao: z.number().default(0),
  largura_px: z.number().positive(),
  altura_px: z.number().positive(),
  regioes: z.array(RegiaoLogoSchema).min(1),
})

export const TextoDesignSchema = z.object({
  texto: z.string().min(1).max(120),
  fonte_id: z.string().min(1),
  aci: aciSchema,
  x: z.number(),
  y: z.number(),
  tamanho_px: z.number().positive(),
})

export const DesignPayloadSchema = z.object({
  pedido_id: z.string().default('SEM-ID'),
  tamanho_mm: z.object({
    largura: z.number().positive().max(MAX_MESA_MM.largura),
    altura: z.number().positive().max(MAX_MESA_MM.altura),
  }),
  viewbox_px: z.object({
    w: z.number().positive(),
    h: z.number().positive(),
  }),
  fundo: z.object({ cor_id: z.string() }).default({ cor_id: 'cinza' }),
  borda: z
    .object({ estilo: z.enum(['sem', 'fina', 'dupla']), aci: aciSchema })
    .default({ estilo: 'sem', aci: 9 }),
  textos: z.array(TextoDesignSchema).default([]),
  logos: z.array(LogoDesignSchema).default([]),
})

export const CriarPedidoSchema = z.object({
  cliente: z.object({
    nome: z.string().min(1).max(120),
    whatsapp: z.string().min(8).max(20),
  }),
  quantidade: z.number().int().min(1).max(500).default(1),
  design: DesignPayloadSchema,
  previewHash: z.string().min(8),
})
