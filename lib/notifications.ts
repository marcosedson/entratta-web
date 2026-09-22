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

type Canal = 'ml' | 'shopee'

const CANAL_NAME: Record<Canal, string> = { ml: 'Mercado Livre', shopee: 'Shopee' }

const formatTamanho = (tamanho?: string) => (tamanho ? `${tamanho.replace('x', '×')} cm` : undefined)

export function buildOrderNotification(params: {
  canal: Canal
  orderId: string
  buyerName: string
  tamanho?: string
  cor?: string
  preco?: string
}): string {
  const canalEmoji = params.canal === 'ml' ? '🛒' : '🛍️'
  const canalName = CANAL_NAME[params.canal]

  return `${canalEmoji} *NOVO PEDIDO — ${canalName}*

📦 Pedido: ${params.orderId}
👤 Comprador: ${params.buyerName}
📐 Tamanho: ${formatTamanho(params.tamanho) ?? 'a confirmar'}
🎨 Cor: ${params.cor ?? 'a confirmar'}${params.preco ? `\n💰 Valor: ${params.preco}` : ''}

✍️ Cliente vai mandar texto/logo pelo chat do pedido (${canalName}) — responder e enviar prévia lá.

_Mensagem enviada automaticamente ao comprador_`
}

// Sem link, telefone ou WhatsApp: ML e Shopee moderam dados de contato e links externos no chat do pedido
export function buildBuyerPersonalizationMessage(params: { buyerName: string; tamanho?: string; cor?: string }): string {
  const detalhes = [formatTamanho(params.tamanho), params.cor && `cor ${params.cor}`].filter(Boolean).join(' · ')

  return (
    `Olá ${params.buyerName}! Obrigado pela compra na Entratta.\n\n` +
    (detalhes ? `Seu capacho: ${detalhes}.\n\n` : '') +
    `Para personalizar, responda aqui neste chat com:\n` +
    `1. O texto (nome, frase ou número) exatamente como quer no capacho\n` +
    `2. Sua logo, se tiver, anexada em boa resolução (PNG, JPG ou PDF)\n\n` +
    `Antes de produzir, enviamos aqui a prévia da arte para você aprovar.`
  )
}
