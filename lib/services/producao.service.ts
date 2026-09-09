import type { DesignPayload, VetorizacaoResultado } from '@/lib/types/producao'

/**
 * Cliente HTTP do microserviço de produção (FastAPI).
 * Server-side only — usar apenas em API routes.
 */
const BASE_URL = () => process.env.PRODUCTION_SERVICE_URL ?? 'http://localhost:8000'
const TIMEOUT_MS = 60_000

async function post(path: string, init: RequestInit): Promise<Response> {
  const response = await fetch(`${BASE_URL()}${path}`, {
    ...init,
    method: 'POST',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Serviço de produção ${path} falhou (${response.status}): ${detail}`)
  }
  return response
}

export class ProducaoService {
  /** PNG fotorrealista determinístico — a prévia oficial que o cliente aprova. */
  static async gerarPreview(design: DesignPayload): Promise<Buffer> {
    const response = await post('/preview', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design),
    })
    return Buffer.from(await response.arrayBuffer())
  }

  /** ZIP com um .tap (G-code Mach3) por cor ACI usada no design. */
  static async gerarProducao(design: DesignPayload): Promise<Buffer> {
    const response = await post('/generate', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design),
    })
    return Buffer.from(await response.arrayBuffer())
  }

  /** Logo raster/SVG → regiões vetoriais com cor ACI sugerida por região. */
  static async vetorizarLogo(file: File): Promise<VetorizacaoResultado> {
    const form = new FormData()
    form.append('file', file)
    const response = await post('/vectorize', { body: form })
    return response.json()
  }
}
