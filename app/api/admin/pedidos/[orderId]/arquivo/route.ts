import { NextRequest, NextResponse } from 'next/server'

import { OrderRepository } from '@/lib/repositories/order.repo'
import { isAdminAuthorized } from '@/lib/services/admin-auth'

/** GET ?tipo=zip|preview — download do zip de produção ou da prévia aprovada. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const { orderId } = await params
  const tipo = request.nextUrl.searchParams.get('tipo') ?? 'zip'
  const nome = tipo === 'preview' ? 'preview.png' : 'producao.zip'
  const dados = OrderRepository.lerArquivo(orderId, nome)
  if (!dados) return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })

  return new NextResponse(new Uint8Array(dados), {
    headers: tipo === 'preview'
      ? { 'Content-Type': 'image/png' }
      : {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${orderId}-producao.zip"`,
        },
  })
}
