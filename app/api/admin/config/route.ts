import { NextRequest, NextResponse } from 'next/server'
import { getAdminConfig, saveAdminConfig } from '@/lib/adminConfig'

export async function GET() {
  return NextResponse.json(getAdminConfig())
}

export async function POST(request: NextRequest) {
  const senha = request.headers.get('x-admin-password')
  if (!senha || senha !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const body = await request.json()
  saveAdminConfig({
    diasUteis: Number(body.diasUteis) || 7,
    coresDisponiveis: Array.isArray(body.coresDisponiveis) ? body.coresDisponiveis : [],
    aviso: String(body.aviso ?? ''),
  })
  return NextResponse.json({ ok: true })
}
