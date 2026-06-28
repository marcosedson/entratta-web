import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { saveShopeeTokens } from '@/lib/shopee-api'

const BASE_URL = () => process.env.NEXT_PUBLIC_BASE_URL ?? 'https://entratta.com.br'
const SHOPEE_BASE = 'https://partner.shopeemobile.com'

function partnerSign(path: string, timestamp: number): string {
  const partnerId = process.env.SHOPEE_PARTNER_ID!
  const partnerKey = process.env.SHOPEE_PARTNER_KEY!
  return createHmac('sha256', partnerKey).update(`${partnerId}${path}${timestamp}`).digest('hex')
}

// GET /api/auth/shopee → inicia OAuth
// GET /api/auth/shopee?code=...&shop_id=... → callback, salva tokens
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const shopId = request.nextUrl.searchParams.get('shop_id')

  if (!code || !shopId) {
    const ts = Math.floor(Date.now() / 1000)
    const path = '/api/v2/shop/auth_partner'
    const s = partnerSign(path, ts)
    const redirectUrl = encodeURIComponent(`${BASE_URL()}/api/auth/shopee`)
    const url = `${SHOPEE_BASE}${path}?partner_id=${process.env.SHOPEE_PARTNER_ID}&timestamp=${ts}&sign=${s}&redirect=${redirectUrl}`
    return NextResponse.redirect(url)
  }

  const ts = Math.floor(Date.now() / 1000)
  const path = '/api/v2/auth/token/get'
  const s = partnerSign(path, ts)

  const tokenRes = await fetch(`${SHOPEE_BASE}${path}?partner_id=${process.env.SHOPEE_PARTNER_ID}&timestamp=${ts}&sign=${s}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      shop_id: Number(shopId),
      partner_id: Number(process.env.SHOPEE_PARTNER_ID),
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Falha na autenticação Shopee' }, { status: 400 })
  }

  const data = await tokenRes.json()

  saveShopeeTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expire_in ?? 14400) * 1000,
    shop_id: Number(shopId),
  })

  return NextResponse.redirect(`${BASE_URL()}/admin/integracoes?shopee=ok`)
}
