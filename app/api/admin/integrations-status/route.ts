import { NextResponse } from 'next/server'
import { getMLTokens } from '@/lib/ml-api'
import { getShopeeTokens } from '@/lib/shopee-api'

export async function GET() {
  const ml = getMLTokens()
  const shopee = getShopeeTokens()
  const evo = !!(process.env.EVOLUTION_API_URL && process.env.EVOLUTION_API_KEY && process.env.EVOLUTION_INSTANCE && process.env.EVOLUTION_GROUP_JID)

  return NextResponse.json({
    ml: ml ? { ok: true, user_id: ml.user_id, expira: new Date(ml.expires_at).toISOString() } : { ok: false },
    shopee: shopee ? { ok: true, shop_id: shopee.shop_id, expira: new Date(shopee.expires_at).toISOString() } : { ok: false },
    evolution: { ok: evo },
  })
}
