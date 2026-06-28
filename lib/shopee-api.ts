import { createHmac } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const TOKENS_PATH = join(process.cwd(), 'data', 'shopee-tokens.json')
const SHOPEE_BASE = 'https://partner.shopeemobile.com'

export interface ShopeeTokens {
  access_token: string
  refresh_token: string
  expires_at: number
  shop_id: number
}

export function getShopeeTokens(): ShopeeTokens | null {
  try {
    if (!existsSync(TOKENS_PATH)) return null
    return JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'))
  } catch { return null }
}

export function saveShopeeTokens(tokens: ShopeeTokens): void {
  writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2))
}

function sign(path: string, timestamp: number, accessToken = '', shopId = 0): string {
  const partnerId = process.env.SHOPEE_PARTNER_ID!
  const partnerKey = process.env.SHOPEE_PARTNER_KEY!
  const base = `${partnerId}${path}${timestamp}${accessToken}${shopId || ''}`
  return createHmac('sha256', partnerKey).update(base).digest('hex')
}

export function verifyShopeeWebhook(body: string, signature: string, path: string, timestamp: number): boolean {
  const partnerId = process.env.SHOPEE_PARTNER_ID ?? ''
  const partnerKey = process.env.SHOPEE_PARTNER_KEY ?? ''
  if (!partnerKey) return true
  const base = `${partnerId}${path}${timestamp}${body}`
  const expected = createHmac('sha256', partnerKey).update(base).digest('hex')
  return expected === signature
}

async function refreshShopeeToken(tokens: ShopeeTokens): Promise<ShopeeTokens> {
  const ts = Math.floor(Date.now() / 1000)
  const path = '/api/v2/auth/access_token/get'
  const s = sign(path, ts)
  const res = await fetch(`${SHOPEE_BASE}${path}?partner_id=${process.env.SHOPEE_PARTNER_ID}&timestamp=${ts}&sign=${s}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refresh_token: tokens.refresh_token,
      partner_id: Number(process.env.SHOPEE_PARTNER_ID),
      shop_id: tokens.shop_id,
    }),
  })
  const data = await res.json()
  const newTokens: ShopeeTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? tokens.refresh_token,
    expires_at: Date.now() + (data.expire_in ?? 14400) * 1000,
    shop_id: tokens.shop_id,
  }
  saveShopeeTokens(newTokens)
  return newTokens
}

async function shopeeRequest(path: string, body?: any): Promise<any> {
  let tokens = getShopeeTokens()
  if (!tokens) throw new Error('Shopee não autenticado')
  if (Date.now() > tokens.expires_at - 3_600_000) tokens = await refreshShopeeToken(tokens)

  const ts = Math.floor(Date.now() / 1000)
  const s = sign(path, ts, tokens.access_token, tokens.shop_id)
  const url = `${SHOPEE_BASE}${path}?partner_id=${process.env.SHOPEE_PARTNER_ID}&timestamp=${ts}&access_token=${tokens.access_token}&shop_id=${tokens.shop_id}&sign=${s}`

  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

export async function getShopeeOrder(ordersn: string): Promise<any> {
  return shopeeRequest('/api/v2/order/get_order_detail', {
    order_list: [{ ordersn }],
    response_optional_fields: 'buyer_user_id,item_list,order_status,buyer_username',
  })
}

export async function sendShopeeMessage(toUserId: number, text: string): Promise<void> {
  await shopeeRequest('/api/v2/sellerchat/send_message', {
    touid: toUserId,
    message_type: 'text',
    content: { text },
  })
}

const COR_MAP: Record<string, string> = {
  preto: 'preto', black: 'preto',
  cinza: 'cinza', gray: 'cinza', grey: 'cinza',
  verde: 'verde', green: 'verde',
  azul: 'azul', blue: 'azul',
  vermelho: 'vermelho', red: 'vermelho',
  marrom: 'marrom', brown: 'marrom',
  bege: 'bege', beige: 'bege',
}

export function parseShopeeVariation(orderResponse: any): { tamanho?: string; cor?: string } {
  const order = orderResponse.response?.order_list?.[0] ?? orderResponse.order_list?.[0]
  const item = order?.item_list?.[0]
  const text = [(item?.model_name ?? ''), (item?.item_name ?? '')].join(' ').toLowerCase()

  let cor: string | undefined
  for (const [key, val] of Object.entries(COR_MAP)) {
    if (text.includes(key)) { cor = val; break }
  }

  let tamanho: string | undefined
  const m = text.match(/(\d+)\s*[x×]\s*(\d+)/)
  if (m) tamanho = `${m[1]}x${m[2]}`

  return { tamanho, cor }
}
