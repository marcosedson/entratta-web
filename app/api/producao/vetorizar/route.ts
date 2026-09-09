import { NextRequest, NextResponse } from 'next/server'

import { ProducaoService } from '@/lib/services/producao.service'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  // protect with production key
  const expected = process.env.PRODUCTION_API_KEY
  const incoming = request.headers.get('x-production-key')
  if (!expected || incoming !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Envie o logo no campo "file"' }, { status: 422 })
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'Arquivo maior que 10MB' }, { status: 413 })
  }

  try {
    const resultado = await ProducaoService.vetorizarLogo(file)
    return NextResponse.json(resultado)
  } catch (error) {
    console.error('[producao/vetorizar]', error)
    return NextResponse.json(
      { error: 'Não foi possível vetorizar este arquivo' },
      { status: 422 }
    )
  }
}
