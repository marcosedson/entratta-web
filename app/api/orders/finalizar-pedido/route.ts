import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { detectColoresYAgrupar, gerarSvgPorCor, MEDIDAS as MEDIDAS_MAP } from '@/lib/svg-generator'
import { gerarTapMock } from '@/lib/tap-converter'

// Pasta raiz configurável — no VPS, defina PEDIDOS_DIR no .env.local
const PEDIDOS_DIR = process.env.PEDIDOS_DIR ?? path.join(process.cwd(), 'pedidos')

interface Body {
  pedido?: string
  canal?: string
  medida: string
  corTapete: string
  border: { type: string; color: string }
  textos: any[]
  logos: any[]
  pdfBase64?: string // data:application/pdf;base64,...
}

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json()
    if (!body.medida || !body.corTapete) {
      return NextResponse.json({ error: 'medida e corTapete obrigatórios' }, { status: 400 })
    }

    // Pasta: DD-MM-YYYY / {pedido ou ID gerado}
    const now = new Date()
    const dd = String(now.getDate()).padStart(2, '0')
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const yyyy = now.getFullYear()
    const dataDir = `${dd}-${mm}-${yyyy}`

    const pedidoId = body.pedido ?? `DIRETO-${Date.now()}`
    const pedidoDir = path.join(PEDIDOS_DIR, dataDir, pedidoId)
    await fs.mkdir(pedidoDir, { recursive: true })

    const arquivos: string[] = []

    // 1. Salva PDF se recebido
    if (body.pdfBase64) {
      const base64 = body.pdfBase64.includes(',')
        ? body.pdfBase64.split(',')[1]
        : body.pdfBase64
      const pdfPath = path.join(pedidoDir, `${pedidoId}.pdf`)
      await fs.writeFile(pdfPath, Buffer.from(base64, 'base64'))
      arquivos.push(`${pedidoId}.pdf`)
    }

    // 2. Gera .TAP por camada de cor
    const validBorderTypes = ['none', 'thin', 'double', 'embossed_5cm'] as const
    type BorderType = typeof validBorderTypes[number]
    const rawType = body.border?.type ?? 'none'
    const borderType: BorderType = validBorderTypes.includes(rawType as BorderType) ? (rawType as BorderType) : 'none'

    const config = {
      medida: body.medida,
      corTapete: body.corTapete,
      border: { type: borderType, color: body.border?.color ?? 'branco' },
      textos: body.textos ?? [],
      logos: body.logos ?? [],
    }

    const colorLayers = detectColoresYAgrupar(config)
    const medidaObj = MEDIDAS_MAP[body.medida] ?? { w: 0.6, c: 0.9 }

    for (let i = 0; i < colorLayers.length; i++) {
      const layer = colorLayers[i]
      const num = String(i + 1).padStart(2, '0')
      const tapName = `${pedidoId}_COR${num}_${layer.colorName.toUpperCase()}.tap`
      const svgName = `${pedidoId}_COR${num}_${layer.colorName.toUpperCase()}.svg`

      const svg = gerarSvgPorCor(layer, config, 400)
      await fs.writeFile(path.join(pedidoDir, svgName), svg, 'utf-8')

      const tap = gerarTapMock(svg, layer.colorName, medidaObj, Number(pedidoId.replace(/\D/g, '').slice(-5) || '0'), i + 1, 1)
      await fs.writeFile(path.join(pedidoDir, tapName), tap, 'utf-8')

      arquivos.push(tapName)
    }

    // 3. Salva resumo JSON
    const resumo = {
      pedidoId,
      canal: body.canal ?? 'direto',
      medida: body.medida,
      cor: body.corTapete,
      textos: body.textos?.filter((t: any) => t.texto).map((t: any) => t.texto),
      logos: body.logos?.length ?? 0,
      geradoEm: now.toISOString(),
      arquivos,
    }
    await fs.writeFile(path.join(pedidoDir, 'resumo.json'), JSON.stringify(resumo, null, 2))

    return NextResponse.json({
      ok: true,
      pasta: `${dataDir}/${pedidoId}`,
      arquivos,
    })
  } catch (err: any) {
    console.error('[finalizar-pedido]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
