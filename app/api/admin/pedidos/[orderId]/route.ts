import { NextRequest, NextResponse } from 'next/server'

import { OrderRepository } from '@/lib/repositories/order.repo'
import { isAdminAuthorized } from '@/lib/services/admin-auth'
import type { PedidoStatus } from '@/lib/types/producao'

const STATUS_VALIDOS: PedidoStatus[] = ['novo', 'em_producao', 'concluido']

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const { orderId } = await params
  const pedido = OrderRepository.buscar(orderId)
  if (!pedido) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
  return NextResponse.json({ pedido })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const { orderId } = await params
  const body = await request.json().catch(() => null)
  const status = body?.status as PedidoStatus | undefined
  if (!status || !STATUS_VALIDOS.includes(status)) {
    return NextResponse.json({ error: `status deve ser um de: ${STATUS_VALIDOS.join(', ')}` }, { status: 422 })
  }
  const pedido = OrderRepository.atualizarStatus(orderId, status)
  if (!pedido) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
  return NextResponse.json({ pedido })
}
