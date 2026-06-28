import { NextRequest, NextResponse } from 'next/server'
import { saveMLTokens } from '@/lib/ml-api'

const BASE_URL = () => process.env.NEXT_PUBLIC_BASE_URL ?? 'https://entratta.com.br'
const REDIRECT_URI = () => `${BASE_URL()}/api/auth/ml`

// GET /api/auth/ml → inicia OAuth
// GET /api/auth/ml?code=... → callback, salva tokens
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    const url = new URL('https://auth.mercadolivre.com.br/authorization')
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', process.env.ML_APP_ID!)
    url.searchParams.set('redirect_uri', REDIRECT_URI())
    return NextResponse.redirect(url.toString())
  }

  const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ML_APP_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      code,
      redirect_uri: REDIRECT_URI(),
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Falha na autenticação ML' }, { status: 400 })
  }

  const data = await tokenRes.json()

  const meRes = await fetch('https://api.mercadolibre.com/users/me', {
    headers: { Authorization: `Bearer ${data.access_token}` },
  })
  const me = await meRes.json()

  saveMLTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    user_id: me.id,
  })

  return NextResponse.redirect(`${BASE_URL()}/admin/integracoes?ml=ok`)
}
