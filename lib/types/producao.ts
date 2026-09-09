import { z } from 'zod'

import type {
  CriarPedidoSchema,
  DesignPayloadSchema,
  LogoDesignSchema,
  RegiaoLogoSchema,
  TextoDesignSchema,
} from '@/lib/schemas/producao.schema'

export type DesignPayload = z.infer<typeof DesignPayloadSchema>
export type TextoDesign = z.infer<typeof TextoDesignSchema>
export type LogoDesign = z.infer<typeof LogoDesignSchema>
export type RegiaoLogo = z.infer<typeof RegiaoLogoSchema>
export type CriarPedidoInput = z.infer<typeof CriarPedidoSchema>

export type PedidoStatus = 'novo' | 'em_producao' | 'concluido'

export interface PedidoRecord {
  orderId: string
  criadoEm: string
  status: PedidoStatus
  cliente: { nome: string; whatsapp: string }
  quantidade: number
  design: DesignPayload
  previewHash: string
  arquivos: { preview: string; zip: string }
}

/** Resposta do POST /vectorize do serviço de produção */
export interface VetorizacaoResultado {
  largura_px: number
  altura_px: number
  regioes: Array<{
    cor_original: string
    aci_sugerido: number
    poligonos: Array<{ externo: [number, number][]; furos: [number, number][][] }>
  }>
}
