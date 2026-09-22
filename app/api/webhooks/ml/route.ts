import { NextRequest, NextResponse } from 'next/server'
import { getMLOrder, sendMLMessage, getMLTokens, parseMLVariation } from '@/lib/ml-api'
import { sendWhatsAppGroup, buildOrderNotification, buildBuyerPersonalizationMessage } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  processMLOrder(body).catch(err => console.error('[ML webhook]', err))
  return NextResponse.json({ ok: true })
}

async function processMLOrder(body: any) {
  if (!body || body.topic !== 'orders_v2') return

  const orderId = (body.resource as string)
    ?.replace('/orders/v2/', '')
    ?.replace('/orders/', '')
    ?.split('?')[0]
  if (!orderId) return

  const tokens = getMLTokens()
  if (!tokens) return

  const order = await getMLOrder(orderId)
  const buyerId: number = order.buyer?.id
  const buyerName: string = order.buyer?.nickname ?? 'Cliente'
  const packId: string = String(order.pack_id ?? orderId)
  const preco = order.total_amount
    ? `R$ ${Number(order.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    : undefined

  const { tamanho, cor } = parseMLVariation(order)

  const buyerMsg = buildBuyerPersonalizationMessage({ buyerName, tamanho, cor })

  await sendMLMessage(packId, tokens.user_id, buyerId, buyerMsg).catch(() => {})

  await sendWhatsAppGroup(buildOrderNotification({
    canal: 'ml', orderId, buyerName, tamanho, cor, preco,
  }))
}
