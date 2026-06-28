import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const TOKENS_PATH = join(process.cwd(), 'data', 'ml-tokens.json')

export interface MLTokens {
  access_token: string
  refresh_token: string
  expires_at: number
  user_id: number
}

export function getMLTokens(): MLTokens | null {
  try {
    if (!existsSync(TOKENS_PATH)) return null
    return JSON.parse(readFileSync(TOKENS_PATH, 'utf-8'))
  } catch { return null }
}

export function saveMLTokens(tokens: MLTokens): void {
  writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2))
}

async function refreshMLToken(tokens: MLTokens): Promise<MLTokens> {
  const res = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.ML_APP_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      refresh_token: tokens.refresh_token,
    }),
  })
  if (!res.ok) throw new Error('Falha ao renovar token ML')
  const data = await res.json()
  const newTokens: MLTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    user_id: tokens.user_id,
  }
  saveMLTokens(newTokens)
  return newTokens
}

async function mlRequest(path: string, options: RequestInit = {}): Promise<any> {
  let tokens = getMLTokens()
  if (!tokens) throw new Error('ML não autenticado')
  if (Date.now() > tokens.expires_at - 3_600_000) tokens = await refreshMLToken(tokens)

  const res = await fetch(`https://api.mercadolibre.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(`ML API ${res.status}: ${await res.text()}`)
  return res.json()
}

export async function getMLOrder(orderId: string): Promise<any> {
  return mlRequest(`/orders/${orderId}`)
}

export async function sendMLMessage(packId: string, sellerId: number, buyerId: number, text: string): Promise<void> {
  await mlRequest(`/messages/packs/${packId}/sellers/${sellerId}`, {
    method: 'POST',
    body: JSON.stringify({
      from: { user_id: sellerId },
      to: { user_id: buyerId },
      text,
    }),
  })
}

const COR_MAP: Record<string, string> = {
  preto: 'preto', black: 'preto', negro: 'preto',
  cinza: 'cinza', gray: 'cinza', grey: 'cinza',
  verde: 'verde', green: 'verde',
  azul: 'azul', blue: 'azul',
  vermelho: 'vermelho', red: 'vermelho',
  marrom: 'marrom', brown: 'marrom',
  bege: 'bege', beige: 'bege',
}

export function parseMLVariation(order: any): { tamanho?: string; cor?: string } {
  const item = order.order_items?.[0]
  const attrs: any[] = item?.variation_attributes ?? []

  let tamanho: string | undefined
  let cor: string | undefined

  for (const attr of attrs) {
    const v = (attr.value_name ?? '').toLowerCase().trim()
    const name = (attr.name ?? attr.id ?? '').toLowerCase()

    if (name.includes('cor') || name.includes('color')) {
      for (const [key, val] of Object.entries(COR_MAP)) {
        if (v.includes(key)) { cor = val; break }
      }
    }

    if (name.includes('tamanho') || name.includes('medida') || name.includes('size')) {
      const m = v.match(/(\d+)\s*[x×]\s*(\d+)/)
      if (m) tamanho = `${m[1]}x${m[2]}`
    }
  }

  if (!tamanho) {
    const title = (item?.title ?? '').toLowerCase()
    const m = title.match(/(\d+)\s*[x×]\s*(\d+)/)
    if (m) tamanho = `${m[1]}x${m[2]}`
  }

  if (!cor) {
    const title = (item?.title ?? '').toLowerCase()
    for (const [key, val] of Object.entries(COR_MAP)) {
      if (title.includes(key)) { cor = val; break }
    }
  }

  return { tamanho, cor }
}
