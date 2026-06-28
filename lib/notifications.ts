export async function sendWhatsAppGroup(message: string): Promise<void> {
  const url = process.env.EVOLUTION_API_URL
  const apiKey = process.env.EVOLUTION_API_KEY
  const instance = process.env.EVOLUTION_INSTANCE
  const groupJid = process.env.EVOLUTION_GROUP_JID
  if (!url || !apiKey || !instance || !groupJid) return

  await fetch(`${url}/message/sendText/${instance}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: apiKey,
    },
    body: JSON.stringify({ number: groupJid, text: message }),
  }).catch(() => {})
}

export function buildOrderNotification(params: {
  canal: 'ml' | 'shopee'
  orderId: string
  buyerName: string
  tamanho?: string
  cor?: string
  preco?: string
  configuradorUrl: string
}): string {
  const canalEmoji = params.canal === 'ml' ? '🛒' : '🛍️'
  const canalName = params.canal === 'ml' ? 'Mercado Livre' : 'Shopee'

  return `${canalEmoji} *NOVO PEDIDO — ${canalName}*

📦 Pedido: ${params.orderId}
👤 Comprador: ${params.buyerName}
📐 Tamanho: ${params.tamanho ?? 'a confirmar'}
🎨 Cor: ${params.cor ?? 'a confirmar'}${params.preco ? `\n💰 Valor: ${params.preco}` : ''}

🔗 Link de personalização (enviado ao cliente):
${params.configuradorUrl}

_Mensagem enviada automaticamente ao comprador_`
}
