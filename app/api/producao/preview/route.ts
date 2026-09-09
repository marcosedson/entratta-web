import { NextRequest, NextResponse } from 'next/server'

import { DesignPayloadSchema } from '@/lib/schemas/producao.schema'
import { ProducaoService } from '@/lib/services/producao.service'

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
    const png = await ProducaoService.gerarPreview(parsed.data)
    return new NextResponse(new Uint8Array(png), {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('[producao/preview]', error)
    return NextResponse.json({ error: 'Falha ao gerar prévia' }, { status: 502 })
  }
}
