import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

interface SaveFilesRequest {
  orderId: string
  pdf: string
  tapFiles: Array<{ filename: string; content: string }>
  metadata: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveFilesRequest = await request.json()
    const { orderId, pdf, tapFiles, metadata } = body

    // Cria pasta
    const baseDir = join(process.cwd(), 'public', 'gerados', orderId)
    mkdirSync(baseDir, { recursive: true })

    // Salva PDF
    if (pdf) {
      const pdfBuffer = Buffer.from(pdf.replace(/^data:application\/pdf;base64,/, ''), 'base64')
      writeFileSync(join(baseDir, `${orderId}-projeto.pdf`), pdfBuffer)
    }

    // Salva .TAP files
    for (const tap of tapFiles) {
      writeFileSync(join(baseDir, tap.filename), tap.content)
    }

    // Salva metadata
    writeFileSync(
      join(baseDir, 'metadata.json'),
      JSON.stringify(
        {
          orderId,
          createdAt: new Date().toISOString(),
          ...metadata,
          files: {
            pdf: `${orderId}-projeto.pdf`,
            taps: tapFiles.map((t) => t.filename),
          },
        },
        null,
        2
      )
    )

    // Salva resumo em arquivo de texto
    const summary = `
╔════════════════════════════════════════════════════════════════╗
║                   RESUMO DO PEDIDO                            ║
╚════════════════════════════════════════════════════════════════╝

📋 ID DO PEDIDO: ${orderId}
📅 Data: ${new Date().toLocaleString('pt-BR')}

👤 CLIENTE:
  Nome: ${metadata.clientName || '(não informado)'}
  WhatsApp: ${metadata.clientWhatsApp || '(não informado)'}

📐 ESPECIFICAÇÕES:
  Medida: ${metadata.medida || '(não informado)'}
  Cor do tapete: ${metadata.corTapete || '(não informado)'}
  Cor do texto: ${metadata.corTexto || '(não informado)'}
  Cor da borda: ${metadata.corBorda || '(não informado)'}
  Tipo de borda: ${metadata.borda || '(não informado)'}
  Texto personalizado: ${metadata.texto || '(sem texto)'}

📁 ARQUIVOS GERADOS:
  ✓ PDF: ${orderId}-projeto.pdf
  ✓ .TAP files: ${tapFiles.length}
${tapFiles.map((t) => `    - ${t.filename}`).join('\n')}

🎨 CORES DETECTADAS (se logo):
${metadata.logoColors ? metadata.logoColors.map((c: any) => `  - ${c.label} (${c.hex})`).join('\n') : '  (sem logo)'}

📊 QUALIDADE:
  Acurácia de cor: ${metadata.colorAccuracy ? metadata.colorAccuracy.toFixed(1) + '%' : 'N/A'}
  Preservação de detalhes: ${metadata.detailPreservation ? metadata.detailPreservation.toFixed(1) + '%' : 'N/A'}
  Tempo de processamento: ${metadata.processingTime ? metadata.processingTime.toFixed(2) + 's' : 'N/A'}

📍 LOCALIZAÇÃO DOS ARQUIVOS:
  ${baseDir}

🔗 ACESSO WEB:
  /gerados/${orderId}/

✅ Status: PRONTO PARA MARCH3 CNC

─────────────────────────────────────────────────────────────
Próximas etapas:
1. Transferir arquivo .TAP para March3
2. Configurar material e cores
3. Executar produção
4. Qualidade check
5. Empacotar e enviar
─────────────────────────────────────────────────────────────
`

    writeFileSync(join(baseDir, 'RESUMO.txt'), summary)

    console.log(`
✅ ARQUIVOS SALVOS COM SUCESSO
📁 Pasta: ${baseDir}
🔗 URL: http://localhost:3000/gerados/${orderId}/
    `)

    return NextResponse.json({
      success: true,
      orderId,
      folderPath: baseDir,
      publicUrl: `/gerados/${orderId}/`,
      files: {
        pdf: `${orderId}-projeto.pdf`,
        taps: tapFiles.map((t) => t.filename),
        summary: 'RESUMO.txt',
        metadata: 'metadata.json',
      },
      message: `✅ Arquivos salvos! Acesse: http://localhost:3000/gerados/${orderId}/`,
    })
  } catch (error) {
    console.error('❌ Erro ao salvar arquivos:', error)
    return NextResponse.json(
      {
        error: 'Erro ao salvar arquivos',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
