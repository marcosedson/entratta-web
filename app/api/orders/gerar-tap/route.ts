import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { detectColoresYAgrupar, gerarSvgPorCor, listarCoresOrdenadas, MEDIDAS as MEDIDAS_MAP } from '@/lib/svg-generator'
import { gerarTapMock, gerarMetadata, estimarTempoCorte } from '@/lib/tap-converter'

// Cria pasta de saída se não existir
const OUTPUT_BASE_DIR = '/tmp/entratta_pedidos'

interface RequestBody {
  medida: string
  corTapete: string
  border: { type: 'none' | 'thin' | 'double' | 'embossed_5cm'; color: string }
  textos: any[]
  logos: any[]
  quantidade: number  // ← NOVO: quantidade de unidades
  clienteName?: string
}

async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()

    // Validação básica
    if (!body.medida || !body.corTapete) {
      return NextResponse.json(
        { error: 'medida e corTapete são obrigatórios' },
        { status: 400 }
      )
    }

    // Gera ID único do pedido
    const pedidoId = Math.floor(Math.random() * 100000)

    // Cria config para processar
    const config = {
      medida: body.medida,
      corTapete: body.corTapete,
      border: body.border || { type: 'none', color: 'branco' },
      textos: body.textos || [],
      logos: body.logos || [],
    }

    // 1. Detecta cores e agrupa elementos
    const colorLayers = detectColoresYAgrupar(config)

    if (colorLayers.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma cor detectada na configuração' },
        { status: 400 }
      )
    }

    // 2. Prepara estrutura de pasta: /tmp/entratta_pedidos/YYYY/MM/DD/pedido_ID/
    const now = new Date()
    const year = now.getFullYear().toString()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    const pedidoDir = path.join(OUTPUT_BASE_DIR, year, month, day, `pedido_${pedidoId}`)
    await ensureDir(pedidoDir)

    // 3. Gera SVGs e .TAP para cada cor
    const colorFiles: Array<{
      numero: number
      nome: string
      hex: string
      elemento: string
      arquivo_tap: string
    }> = []

    const medidaObj = MEDIDAS_MAP[config.medida] || { w: 0.6, c: 0.9 }

    for (let i = 0; i < colorLayers.length; i++) {
      const colorLayer = colorLayers[i]
      const colorNumero = i + 1

      // Gera SVG
      const svgContent = gerarSvgPorCor(colorLayer, config, 400)

      // Nomes dos arquivos
      const svgFileName = `pedido_${pedidoId}_COR${String(colorNumero).padStart(2, '0')}_${colorLayer.colorName.toUpperCase()}.svg`
      const tapFileName = `pedido_${pedidoId}_COR${String(colorNumero).padStart(2, '0')}_${colorLayer.colorName.toUpperCase()}.tap`

      const svgPath = path.join(pedidoDir, svgFileName)
      const tapPath = path.join(pedidoDir, tapFileName)

      // Salva SVG
      await fs.writeFile(svgPath, svgContent, 'utf-8')

      // Gera e salva .TAP
      const tapContent = gerarTapMock(svgContent, colorLayer.colorName, medidaObj, pedidoId, colorNumero, body.quantidade || 1)
      await fs.writeFile(tapPath, tapContent, 'utf-8')

      colorFiles.push({
        numero: colorNumero,
        nome: colorLayer.colorName.toUpperCase(),
        hex: colorLayer.colorHex,
        elemento: colorLayer.elementos.borda ? 'borda' : colorLayer.elementos.textos.length > 0 ? 'texto' : 'logo',
        arquivo_tap: tapFileName,
      })
    }

    // 4. Gera e salva metadata.json
    const metadata = gerarMetadata(
      pedidoId,
      body.clienteName || 'Cliente',
      config.medida,
      body.quantidade || 1,
      colorFiles
    )

    const metadataPath = path.join(pedidoDir, 'metadata.json')
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8')

    // 5. Salva config original
    const configPath = path.join(pedidoDir, 'config.json')
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8')

    // 6. Retorna resultado
    return NextResponse.json({
      success: true,
      pedidoId,
      quantidade: body.quantidade || 1,
      pastaLocalizada: `${year}/${month}/${day}/pedido_${pedidoId}`,
      caminhoCompleto: pedidoDir,
      cores: colorFiles,
      arquivos: {
        metadata: 'metadata.json',
        config: 'config.json',
        tap_files: colorFiles.map(c => c.arquivo_tap),
        svg_files: colorFiles.map(c => c.arquivo_tap.replace('.tap', '.svg')),
      },
      resumo: {
        total_cores: colorFiles.length,
        tempo_por_cor_minutos: metadata.tempo_minutos_por_cor,
        tempo_total_minutos: metadata.tempo_total_minutos,
        medida: config.medida,
        cliente: metadata.cliente,
        quantidade: body.quantidade || 1,
        instrucoes: [
          `1. Operador carrega ferramenta BRANCA`,
          `2. Abre arquivo: pedido_${pedidoId}_COR01_BRANCO.tap`,
          `3. Mach3 imprime ${body.quantidade || 1} unidades (mesma cor)`,
          `4. Quando M0 pausar, troca ferramenta para próxima cor`,
          `5. Abre próximo .TAP (COR02)`,
          `6. Repete para todas as cores`,
          `7. Resultado final: ${body.quantidade || 1} tapetes completos com todas as cores`
        ],
      },
    })
  } catch (error) {
    console.error('Erro ao gerar .TAP:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

