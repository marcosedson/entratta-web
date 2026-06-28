// Sistema de Agrupamento de Pedidos por Cor (Batch Processing)
// Otimiza produção agrupando múltiplos pedidos pela mesma cor

interface PedidoSimples {
  id: number
  cores: Array<{ numero: number; nome: string; hex: string; elemento: string }>
}

interface BatchPorCor {
  corNome: string
  corHex: string
  corNumero: number
  pedidos: Array<{
    id: number
    indice: number // Qual pedido na sequência (1º, 2º, 3º...)
  }>
  quantidadeTapetes: number
  tempoEstimadoMinutos: number
}

/**
 * Agrupa pedidos do dia por cor, criando batches otimizados
 *
 * Entrada: Todos os pedidos do dia
 * Saída: Lista de batches, cada um contendo UMA cor para múltiplos pedidos
 *
 * Exemplo:
 *   Pedido 1: [BRANCO, AZUL]
 *   Pedido 2: [BRANCO, VERDE]
 *   Pedido 3: [BRANCO, DOURADO]
 *
 *   Resultado:
 *   - BATCH_BRANCO: [Pedido1, Pedido2, Pedido3]  → 30 tapetes brancos
 *   - BATCH_AZUL: [Pedido1]                       → 10 tapetes azuis
 *   - BATCH_VERDE: [Pedido2]                      → 10 tapetes verdes
 *   - BATCH_DOURADO: [Pedido3]                    → 10 tapetes dourados
 */
export function agruparPorCor(pedidosDoDia: PedidoSimples[]): BatchPorCor[] {
  const batchMap = new Map<string, BatchPorCor>()

  // Itera cada pedido
  pedidosDoDia.forEach(pedido => {
    // Para cada cor do pedido
    pedido.cores.forEach((cor, indiceCorNoPedido) => {
      const chave = `${cor.numero}_${cor.nome}` // "1_BRANCO", "2_AZUL", etc

      if (!batchMap.has(chave)) {
        // Primeiro pedido com essa cor
        batchMap.set(chave, {
          corNome: cor.nome,
          corHex: cor.hex,
          corNumero: cor.numero,
          pedidos: [{ id: pedido.id, indice: indiceCorNoPedido }],
          quantidadeTapetes: 1,
          tempoEstimadoMinutos: estimarTempoCorte(cor.nome),
        })
      } else {
        // Adiciona mais um pedido com essa cor
        const batch = batchMap.get(chave)!
        batch.pedidos.push({ id: pedido.id, indice: indiceCorNoPedido })
        batch.quantidadeTapetes++
      }
    })
  })

  // Converte para array e ordena por número da cor (ordem de execução)
  return Array.from(batchMap.values()).sort((a, b) => a.corNumero - b.corNumero)
}

/**
 * Gera UM arquivo .TAP para um batch inteiro (múltiplos pedidos, 1 cor)
 */
export function gerarTapBatch(
  batch: BatchPorCor,
  medidaPorPedido: Record<number, { w: number; c: number }>,
  pedidosDoDia: PedidoSimples[]
): string {
  let tap = `; ========================================\n`
  tap += `; BATCH: ${batch.corNome.toUpperCase()}\n`
  tap += `; Cor: ${batch.corNome} (${batch.corHex})\n`
  tap += `; Quantidade de tapetes: ${batch.quantidadeTapetes}\n`
  tap += `; Pedidos neste batch: ${batch.pedidos.map(p => `#${p.id}`).join(', ')}\n`
  tap += `; Tempo estimado: ${batch.tempoEstimadoMinutos} min\n`
  tap += `; Gerado: ${new Date().toISOString()}\n`
  tap += `; ========================================\n\n`

  tap += `G21 ; Unidades em mm\n`
  tap += `G90 ; Modo absoluto\n`
  tap += `G0 Z10 ; Levanta ferramenta\n`
  tap += `S5000 ; Spindle speed\n`
  tap += `M3 ; Inicia spindle\n\n`

  // Para cada pedido no batch
  batch.pedidos.forEach((itemBatch, idx) => {
    const pedido = pedidosDoDia.find(p => p.id === itemBatch.id)!
    const medida = medidaPorPedido[itemBatch.id] || { w: 0.6, c: 0.9 }

    tap += `; ========== PEDIDO #${itemBatch.id} ==========\n`
    tap += `G0 X${10 + idx * 70} Y10 ; Move para pedido ${idx + 1}\n`
    tap += `G1 Z0 F100 ; Desce ferramenta\n`

    // Simula corte para este pedido (em produção seria SheetCAM)
    const numLinhas = 5
    const espaco = 20 / numLinhas
    for (let i = 0; i < numLinhas; i++) {
      const y = 10 + i * espaco
      const xFinal = i % 2 === 0 ? 40 + idx * 70 : 10 + idx * 70
      tap += `G1 X${xFinal} Y${y} F100 ; Linha ${i + 1} pedido ${idx + 1}\n`
    }

    tap += `G0 Z10 ; Levanta ferramenta\n`
    tap += `\n`
  })

  tap += `G0 X0 Y0 ; Retorna para origem\n`
  tap += `M5 ; Para spindle\n`
  tap += `M0 ; PAUSA: Troque para próxima cor\n`
  tap += `M30 ; FIM\n`

  return tap
}

/**
 * Estima tempo de corte por cor
 */
function estimarTempoCorte(colorName: string): number {
  const tempos: Record<string, number> = {
    branco: 8,
    dourado: 6,
    verde: 5,
    azul: 5,
    vermelho: 5,
    preto: 10,
    cinza: 6,
    marrom: 6,
  }
  return (tempos[colorName.toLowerCase()] || 5) * 1 // Multiplicar por quantidade de tapetes depois
}

/**
 * Metadados do batch para o operador
 */
export interface MetadadosBatch {
  dataProducao: string
  batches: Array<{
    numero: number
    corNome: string
    corHex: string
    quantidadeTapetes: number
    pedidos: number[] // IDs dos pedidos
    tempoEstimadoMinutos: number
    arquivo: string
    statusExecucao: 'nao_iniciado' | 'em_producao' | 'concluido'
  }>
  tempoTotalMinutos: number
  statusGeral: 'nao_iniciado' | 'em_producao' | 'concluido'
}

/**
 * Gera metadados completos para o dia de produção
 */
export function gerarMetadadosBatch(
  batches: BatchPorCor[],
  dataDia: Date
): MetadadosBatch {
  return {
    dataProducao: dataDia.toISOString().split('T')[0],
    batches: batches.map((batch, idx) => ({
      numero: idx + 1,
      corNome: batch.corNome,
      corHex: batch.corHex,
      quantidadeTapetes: batch.quantidadeTapetes,
      pedidos: batch.pedidos.map(p => p.id),
      tempoEstimadoMinutos: batch.tempoEstimadoMinutos,
      arquivo: `BATCH_${String(idx + 1).padStart(2, '0')}_${batch.corNome.toUpperCase()}.tap`,
      statusExecucao: 'nao_iniciado',
    })),
    tempoTotalMinutos: batches.reduce((sum, b) => sum + b.tempoEstimadoMinutos, 0),
    statusGeral: 'nao_iniciado',
  }
}

