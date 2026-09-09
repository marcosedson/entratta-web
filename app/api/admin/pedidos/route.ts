import { NextRequest, NextResponse } from 'next/server'

import { OrderRepository } from '@/lib/repositories/order.repo'
import { isAdminAuthorized } from '@/lib/services/admin-auth'

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const pedidos = OrderRepository.listar().map(p => ({
    orderId: p.orderId,
    criadoEm: p.criadoEm,
    status: p.status,
    cliente: p.cliente,
    quantidade: p.quantidade,
    medida: `${p.design.tamanho_mm.largura}×${p.design.tamanho_mm.altura}mm`,
  }))
  return NextResponse.json({ pedidos })
}
