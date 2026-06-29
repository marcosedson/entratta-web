import { NextRequest, NextResponse } from 'next/server'
import { LogoProcessingService } from '@/lib/services/logo-processing.service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const orderId = formData.get('orderId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId não fornecido' },
        { status: 400 }
      )
    }

    // Valida tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Arquivo deve ser uma imagem (PNG, JPG, etc)' },
        { status: 400 }
      )
    }

    // Converte para buffer
    const buffer = await file.arrayBuffer()
    const bufferNode = Buffer.from(buffer)

    // Processa logo
    const result = await LogoProcessingService.processLogoComplete(bufferNode, orderId)

    console.log(`
✅ LOGO PROCESSADA
├─ Order ID: ${orderId}
├─ Arquivo: ${file.name}
├─ Cores detectadas: ${result.colors.length}
├─ .TAP files gerados: ${result.tapFiles.length}
└─ Status: ${result.success ? 'Sucesso' : 'Erro'}

Cores identificadas:
${result.colors.map((c) => `  • ${c.hex} → ${c.label} (${c.vinyl_hex})`).join('\n')}

Arquivos .TAP:
${result.tapFiles.map((f) => `  • ${f}`).join('\n')}
    `)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao processar logo:', error)
    return NextResponse.json(
      { error: 'Erro ao processar logo', details: String(error) },
      { status: 500 }
    )
  }
}
