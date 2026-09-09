import { NextRequest, NextResponse } from 'next/server'

import { DesignPayloadSchema } from '@/lib/schemas/producao.schema'
import { ProducaoService } from '@/lib/services/producao.service'

/** Gera o zip de produção (um .tap por cor) sem criar pedido — uso interno/admin. */
export async function POST(request: NextRequest) {
  // protect with production key
  const expected = process.env.PRODUCTION_API_KEY
  const incoming = request.headers.get('x-production-key')
  if (!expected || incoming !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = DesignPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Design inválido', detalhes: parsed.error.issues },
      { status: 422 }
    )
  }

  try {
    const zip = await ProducaoService.gerarProducao(parsed.data)
    return new NextResponse(new Uint8Array(zip), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${parsed.data.pedido_id}-producao.zip"`,
      },
    })
  } catch (error) {
    console.error('[producao/gerar]', error)
    return NextResponse.json({ error: 'Falha ao gerar arquivos de produção' }, { status: 502 })
  }
}
