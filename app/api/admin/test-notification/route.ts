import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppGroup, buildOrderNotification } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  const senha = request.headers.get('x-admin-password')
  if (senha && senha !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const configuradorUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://entratta.com.br'}/monte-o-seu?tamanho=60x90&cor=preto&pedido=TESTE-001&canal=ml`

    await sendWhatsAppGroup(buildOrderNotification({
      canal: 'ml',
      orderId: 'TESTE-001',
      buyerName: 'Cliente Teste',
      tamanho: '60x90',
      cor: 'preto',
      preco: 'R$ 162,00',
      configuradorUrl,
    }))

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message })
  }
}
