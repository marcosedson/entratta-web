import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { agruparPorCor, gerarTapBatch, gerarMetadadosBatch } from '@/lib/batch-processor'

const OUTPUT_BASE_DIR = '/tmp/entratta_producao'

interface PedidoParaBatch {
  id: number
  cores: Array<{ numero: number; nome: string; hex: string; elemento: string }>
  medida: string
}

async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err
  }
}

/**
 * POST /api/orders/gerar-batches
 *
 * Recebe lista de todos os pedidos do dia
 * Agrupa por cor
 * Gera um .TAP por cor (não por pedido)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!Array.isArray(body.pedidos) || body.pedidos.length === 0) {
      return NextResponse.json(
        { error: 'Enviar array de pedidos com cores' },
        { status: 400 }
      )
    }

    const pedidos = body.pedidos as PedidoParaBatch[]
    const dataDia = new Date(body.dataDia || new Date())

    // 1. Agrupa por cor
    const batches = agruparPorCor(pedidos)

    if (batches.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma cor detectada' },
        { status: 400 }
      )
    }

    // 2. Cria pasta do dia
    const year = dataDia.getFullYear().toString()
    const month = String(dataDia.getMonth() + 1).padStart(2, '0')
    const day = String(dataDia.getDate()).padStart(2, '0')

    const pastaProducao = path.join(OUTPUT_BASE_DIR, year, month, day, 'PRODUCAO')
    await ensureDir(pastaProducao)

    // 3. Gera arquivo .TAP para cada batch (cor)
    const batchesArquivos = []

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      const batchNum = i + 1

      // Gera conteúdo do .TAP
      const medidaPorPedido: Record<number, any> = {}
      pedidos.forEach(p => {
        medidaPorPedido[p.id] = { w: 0.6, c: 0.9 } // Mock, em produção seria real
      })

      const tapContent = gerarTapBatch(batch, medidaPorPedido, pedidos)

      // Nome do arquivo
      const fileName = `BATCH_${String(batchNum).padStart(2, '0')}_${batch.corNome.toUpperCase()}.tap`
      const filePath = path.join(pastaProducao, fileName)

      // Salva arquivo
      await fs.writeFile(filePath, tapContent, 'utf-8')

      batchesArquivos.push({
        numero: batchNum,
        corNome: batch.corNome,
        corHex: batch.corHex,
        quantidadeTapetes: batch.quantidadeTapetes,
        pedidos: batch.pedidos.map(p => p.id),
        tempoEstimadoMinutos: batch.tempoEstimadoMinutos,
        arquivo: fileName,
      })
    }

    // 4. Gera metadata
    const metadadosBatch = gerarMetadadosBatch(batches, dataDia)
    const metadataPath = path.join(pastaProducao, 'BATCHES_METADATA.json')
    await fs.writeFile(metadataPath, JSON.stringify(metadadosBatch, null, 2), 'utf-8')

    // 5. Salva lista original de pedidos
    const pedidosPath = path.join(pastaProducao, 'PEDIDOS_DO_DIA.json')
    await fs.writeFile(pedidosPath, JSON.stringify(pedidos, null, 2), 'utf-8')

    // 6. Retorna resultado
    return NextResponse.json({
      success: true,
      dataProducao: `${year}-${month}-${day}`,
      pastaProducao: `${year}/${month}/${day}/PRODUCAO`,
      caminhoCompleto: pastaProducao,
      totalPedidos: pedidos.length,
      totalBatches: batches.length,
      totalTapetes: batches.reduce((sum, b) => sum + b.quantidadeTapetes, 0),
      tempoTotalMinutos: batches.reduce((sum, b) => sum + b.tempoEstimadoMinutos, 0),
      batches: batchesArquivos,
      arquivos: {
        metadata: 'BATCHES_METADATA.json',
        pedidos: 'PEDIDOS_DO_DIA.json',
        taps: batchesArquivos.map(b => b.arquivo),
      },
      proximosPassos: [
        '1. Operador carrega ferramenta para COR 1',
        '2. Abre BATCH_01_[COR].tap no Mach3',
        '3. Executa (imprime ~30 tapetes da mesma cor)',
        '4. Quando M0 pausar, troca para próxima cor',
        '5. Abre BATCH_02_[COR].tap',
        '6. Repete até finalizar todos os batches',
      ],
    })
  } catch (error) {
    console.error('Erro ao gerar batches:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

