import { NextRequest, NextResponse } from 'next/server'
import { getShopeeOrder, sendShopeeMessage, parseShopeeVariation, verifyShopeeWebhook } from '@/lib/shopee-api'
import { sendWhatsAppGroup, buildOrderNotification } from '@/lib/notifications'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://entratta.com.br'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  // Shopee envia a assinatura no header Authorization
  const signature = request.headers.get('authorization') ?? ''
  const timestamp = Number(request.headers.get('timestamp') ?? 0)
  const path = '/api/webhooks/shopee'

  if (!verifyShopeeWebhook(rawBody, signature, path, timestamp)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const body = JSON.parse(rawBody)
  processShopeeOrder(body).catch(err => console.error('[Shopee webhook]', err))
  return NextResponse.json({ ok: true })
}

async function processShopeeOrder(body: any) {
  // code 3 = ORDER_STATUS_UPDATE — filtramos por READY_TO_SHIP (pedido pago)
  if (body.code !== 3) return
  const status = body.data?.status ?? body.data?.order_status ?? ''
  if (status !== 'READY_TO_SHIP' && status !== 'PROCESSED') return

  const ordersn: string = body.data?.ordersn ?? body.data?.order_sn ?? ''
  if (!ordersn) return

  const orderData = await getShopeeOrder(ordersn)
  const order = orderData.response?.order_list?.[0] ?? orderData.order_list?.[0]
  if (!order) return

  const buyerId: number = order.buyer_user_id
  const buyerName: string = order.buyer_username ?? 'Cliente'
  const { tamanho, cor } = parseShopeeVariation(orderData.response ?? orderData)

  const params = new URLSearchParams({ canal: 'shopee', pedido: ordersn })
  if (tamanho) params.set('tamanho', tamanho)
  if (cor) params.set('cor', cor)
  const configuradorUrl = `${BASE_URL}/monte-o-seu?${params}`

  const buyerMsg =
    `Olá ${buyerName}! 👋\n\n` +
    `Obrigado pela compra na Entratta! Para personalizar seu capacho com texto e/ou logo, acesse:\n\n` +
    `${configuradorUrl}\n\n` +
    `O tamanho e a cor que você escolheu já estão pré-selecionados. Qualquer dúvida, responda aqui! 😊`

  if (buyerId) await sendShopeeMessage(buyerId, buyerMsg).catch(() => {})

  await sendWhatsAppGroup(buildOrderNotification({
    canal: 'shopee', orderId: ordersn, buyerName, tamanho, cor, configuradorUrl,
  }))
}
