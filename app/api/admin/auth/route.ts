import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { senha } = await request.json()
  if (senha === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
}
