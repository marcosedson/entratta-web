// Conversor SVG para .TAP (mock)
// Simula g-code básico para Mach3

/**
 * Gera .TAP mock para uma cor específica
 *
 * IMPORTANTE: Cada .TAP usa as MESMAS POSIÇÕES XY dos elementos
 * Isso garante que cores diferentes fiquem SOBREPOSTAS corretamente (overlay)
 *
 * Nota: Este é um mock para validação de estrutura.
 * Em produção, seria SheetCAM quem geraria o g-code real.
 */
export function gerarTapMock(
  svgContent: string,
  colorName: string,
  medidaCm: { w: number; c: number },
  pedidoId: number,
  corNumero: number,
  quantidade: number = 1,
  posicoes?: Array<{ x: number; y: number; elemento: string }> // Posições dos elementos
): string {
  // Configurações CNC mock
  const feedRate = 100 // mm/min
  const spindleSpeed = 5000 // RPM (para plotter de vinil)
  const rapidRate = 200

  // Converte cm para mm (Mach3 usa mm)
  const width = medidaCm.w * 10 // 6cm = 60mm
  const height = medidaCm.c * 10 // 9cm = 90mm

  // Tempo estimado de corte por unidade
  const estimatedCutTimePerUnit = Math.round((width + height) * 2 * 0.6) // segundos
  const totalCutTime = estimatedCutTimePerUnit * quantidade

  // Gera g-code básico
  let tap = `; ========================================\n`
  tap += `; ARQUIVO: pedido_${pedidoId}_COR${String(corNumero).padStart(2, '0')}_${colorName.toUpperCase()}.tap\n`
  tap += `; Cor: ${colorName.toUpperCase()}\n`
  tap += `; Quantidade: ${quantidade} unidades\n`
  tap += `; Medida por unidade: ${width}mm x ${height}mm\n`
  tap += `; Tempo por unidade: ~${estimatedCutTimePerUnit} segundos\n`
  tap += `; Tempo total: ~${Math.round(totalCutTime / 60)} minutos\n`
  tap += `; Gerado automaticamente pelo sistema Entratta\n`
  tap += `; Data: ${new Date().toISOString()}\n`
  tap += `; ========================================\n\n`

  tap += `G21 ; Unidades em mm\n`
  tap += `G90 ; Modo absoluto\n`
  tap += `G0 Z10 ; Levanta ferramenta\n`
  tap += `S${spindleSpeed} ; Define velocidade do spindle\n`
  tap += `M3 ; Inicia spindle\n\n`

  // Simulação de cortes (padrão de comb)
  tap += `; ===== INÍCIO DE CORTE =====\n`
  tap += `G0 X10 Y10 ; Move para início\n`
  tap += `G1 Z0 F${feedRate} ; Desce ferramenta\n\n`

  // Cria padrão de corte em zigue-zague
  tap += `; Padrão de corte (simulado)\n`
  const numLinhas = 10
  const espaco = height / numLinhas

  for (let i = 0; i < numLinhas; i++) {
    const y = 10 + i * espaco
    const xFinal = i % 2 === 0 ? width + 10 : 10 // Alterna direção
    const xInicial = i % 2 === 0 ? 10 : width + 10

    tap += `G0 X${xInicial} Y${y} ; Move para linha ${i + 1}\n`
    tap += `G1 X${xFinal} Y${y} F${feedRate} ; Corta linha\n`
  }

  tap += `\n; ===== FIM DE CORTE =====\n`
  tap += `G0 Z10 ; Levanta ferramenta\n`
  tap += `G0 X0 Y0 ; Retorna para origem\n\n`

  tap += `M5 ; Para o spindle\n`
  tap += `M30 ; Fim do programa\n`

  return tap
}

/**
 * Metadados da cor para armazenar junto
 */
export interface ColorMetadata {
  numero: number
  nome: string
  hex: string
  elemento: string
  tempo_minutos: number
  arquivo_tap: string
}

/**
 * Simula tempo de corte baseado em complexidade
 */
export function estimarTempoCorte(colorName: string, medida: string): number {
  // Tempo base por medida (minutos)
  const tempoBase: Record<string, number> = {
    '40x60': 3,
    '60x90': 5,
    '80x120': 8,
  }

  // Adiciona tempo baseado em cor (complexidade)
  const tempoAdicional: Record<string, number> = {
    branco: 2, // Borda geralmente demora
    dourado: 1,
    verde: 1,
    azul: 1,
    vermelho: 1,
    preto: 2, // Mais denso
  }

  const base = tempoBase[medida] || 5
  const extra = tempoAdicional[colorName.toLowerCase()] || 1

  return base + extra
}

/**
 * Gera conteúdo de metadata.json para o pedido
 */
export function gerarMetadata(
  pedidoId: number,
  cliente: string,
  medida: string,
  quantidade: number,
  cores: Array<{ numero: number; nome: string; hex: string; elemento: string; arquivo_tap: string }>
) {
  return {
    id: pedidoId,
    cliente: cliente || 'Cliente',
    data_pedido: new Date().toISOString(),
    medida: medida,
    quantidade: quantidade,
    cores_totais: cores.length,
    cores: cores.map(cor => ({
      numero: cor.numero,
      nome: cor.nome,
      hex: cor.hex,
      elemento: cor.elemento,
      tempo_minutos_por_cor: estimarTempoCorte(cor.nome.toLowerCase(), medida),
      arquivo: cor.arquivo_tap,
    })),
    tempo_minutos_por_cor: cores.reduce((sum, c) => sum + estimarTempoCorte(c.nome.toLowerCase(), medida), 0),
    tempo_total_minutos: cores.reduce((sum, c) => sum + estimarTempoCorte(c.nome.toLowerCase(), medida), 0) * quantidade,
    status: 'pronto_para_producao',
    instrucoes: [
      `Este pedido tem ${cores.length} cores.`,
      `Para CADA cor, o operador imprime ${quantidade} unidades da mesma cor/ferramenta.`,
      `Tempo total estimado: ${cores.reduce((sum, c) => sum + estimarTempoCorte(c.nome.toLowerCase(), medida), 0) * quantidade} minutos.`
    ]
  }
}

