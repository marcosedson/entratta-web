/**
 * Conversor de coordenadas SVG ↔ Dimensões Reais (cm)
 *
 * O canvas SVG é uma representação visual, mas o tapete real tem dimensões reais.
 * Este serviço converte entre coordenadas de tela (px) e medidas reais (cm).
 */

export interface RealDimensions {
  larguraCm: number  // Largura do tapete em CM
  comprimentoCm: number  // Comprimento do tapete em CM
}

export interface CanvasDimensions {
  canvasWidth: number  // Largura do canvas SVG em PX
  canvasHeight: number  // Altura do canvas SVG em PX
}

export interface CoordinateMapping {
  pxPerCmX: number  // Pixels por CM na largura
  pxPerCmY: number  // Pixels por CM na altura
  offsetX: number
  offsetY: number
}

export class CoordinateScaler {
  /**
   * Calcula mapeamento de coordenadas
   * @param realDims Dimensões reais do tapete em CM
   * @param canvasDims Dimensões do canvas em PX
   * @returns Mapeamento de escala
   */
  static calculateMapping(
    realDims: RealDimensions,
    canvasDims: CanvasDimensions
  ): CoordinateMapping {
    const pxPerCmX = canvasDims.canvasWidth / realDims.larguraCm
    const pxPerCmY = canvasDims.canvasHeight / realDims.comprimentoCm

    return {
      pxPerCmX,
      pxPerCmY,
      offsetX: 0,
      offsetY: 0,
    }
  }

  /**
   * Converte posição do SVG (px) para posição real (cm)
   * @param pxX Posição X em pixels no SVG
   * @param pxY Posição Y em pixels no SVG
   * @param mapping Mapeamento de coordenadas
   * @returns Posição real em centímetros
   */
  static pxToRealCoordinates(
    pxX: number,
    pxY: number,
    mapping: CoordinateMapping
  ): { cmX: number; cmY: number } {
    return {
      cmX: (pxX - mapping.offsetX) / mapping.pxPerCmX,
      cmY: (pxY - mapping.offsetY) / mapping.pxPerCmY,
    }
  }

  /**
   * Converte dimensão do SVG (px) para dimensão real (cm)
   * @param pxSize Tamanho em pixels
   * @param axis Eixo ('x' ou 'y') para saber qual escala usar
   * @param mapping Mapeamento de coordenadas
   * @returns Tamanho real em centímetros
   */
  static pxSizeToRealSize(
    pxSize: number,
    axis: 'x' | 'y',
    mapping: CoordinateMapping
  ): number {
    const pxPerCm = axis === 'x' ? mapping.pxPerCmX : mapping.pxPerCmY
    return pxSize / pxPerCm
  }

  /**
   * Converte posição real (cm) para posição do SVG (px)
   * @param cmX Posição X em centímetros
   * @param cmY Posição Y em centímetros
   * @param mapping Mapeamento de coordenadas
   * @returns Posição em pixels no SVG
   */
  static realToPixelCoordinates(
    cmX: number,
    cmY: number,
    mapping: CoordinateMapping
  ): { pxX: number; pxY: number } {
    return {
      pxX: cmX * mapping.pxPerCmX + mapping.offsetX,
      pxY: cmY * mapping.pxPerCmY + mapping.offsetY,
    }
  }

  /**
   * Calcula tamanho de texto ideal baseado em tamanho de texto SVG
   * @param svgFontSize Tamanho de fonte no SVG (px)
   * @param mapping Mapeamento de coordenadas
   * @returns Tamanho ideal de fonte para impressão (pt)
   *
   * Heurística: assume que fonte de 1pt ≈ 1.333px na tela
   * Para impressão, usamos proportionalmente
   */
  static calculatePrintFontSize(
    svgFontSize: number,
    mapping: CoordinateMapping
  ): number {
    // Converte tamanho visual para tamanho de impressão
    // Aproximação: 1pt ≈ 1.333px visualmente
    const pxToPt = 0.75
    const printSize = svgFontSize * pxToPt

    // Garante um mínimo de 6pt para legibilidade
    return Math.max(6, Math.round(printSize * 10) / 10)
  }

  /**
   * Calcula tamanho mínimo para texto legível no tapete
   * @param larguraCm Largura do tapete
   * @param comprimentoCm Comprimento do tapete
   * @returns Tamanho mínimo de fonte (px no SVG)
   */
  static getMinimumFontSize(
    larguraCm: number,
    comprimentoCm: number
  ): number {
    // Mínimo: ~2cm do tapete (para legibilidade)
    const minCm = Math.min(larguraCm, comprimentoCm) * 0.05 // 5% da menor dimensão
    return Math.max(12, Math.round(minCm * 10)) // Mínimo de 12px
  }

  /**
   * Calcula tamanho máximo para texto no tapete
   * @param larguraCm Largura do tapete
   * @param comprimentoCm Comprimento do tapete
   * @returns Tamanho máximo de fonte (px no SVG)
   */
  static getMaximumFontSize(
    larguraCm: number,
    comprimentoCm: number
  ): number {
    // Máximo: ~30% do menor eixo
    const maxCm = Math.min(larguraCm, comprimentoCm) * 0.3
    return Math.round(maxCm * 20) // Aproximadamente
  }

  /**
   * Sugere tamanho padrão para texto baseado na dimensão
   * @param textLength Quantidade de caracteres
   * @param larguraCm Largura disponível (cm)
   * @param canvasWidth Largura do canvas (px)
   * @returns Tamanho sugerido de fonte (px)
   */
  static suggestFontSize(
    textLength: number,
    larguraCm: number,
    canvasWidth: number
  ): number {
    // Cada caractere ocupa aproximadamente 0.55 da altura da fonte
    const charWidthFactor = 0.55

    // Espaço disponível em pixels
    const availablePx = (canvasWidth * 0.85) // 85% da largura

    // Tamanho sugerido
    const suggested = availablePx / (textLength * charWidthFactor)

    // Limita entre 12px e 48px
    return Math.max(12, Math.min(48, Math.round(suggested)))
  }

  /**
   * Gera relatório de dimensões para debugging/validação
   */
  static getScalingReport(
    realDims: RealDimensions,
    canvasDims: CanvasDimensions,
    mapping: CoordinateMapping
  ): string {
    return `
SCALING REPORT
═════════════════════════════════════════

DIMENSÕES REAIS (TAPETE):
  Largura: ${realDims.larguraCm} cm
  Comprimento: ${realDims.comprimentoCm} cm
  Proporção: ${(realDims.larguraCm / realDims.comprimentoCm).toFixed(2)}

DIMENSÕES DO CANVAS (SVG):
  Largura: ${canvasDims.canvasWidth} px
  Altura: ${canvasDims.canvasHeight} px
  Proporção: ${(canvasDims.canvasWidth / canvasDims.canvasHeight).toFixed(2)}

FATOR DE ESCALA:
  Eixo X: ${mapping.pxPerCmX.toFixed(2)} px/cm
  Eixo Y: ${mapping.pxPerCmY.toFixed(2)} px/cm

VALIDAÇÃO:
  ✓ Proporções correspondem: ${
    Math.abs(
      realDims.larguraCm / realDims.comprimentoCm -
      canvasDims.canvasWidth / canvasDims.canvasHeight
    ) < 0.05
      ? 'SIM'
      : 'NÃO (recomenda-se ajustar)'
  }
  ✓ Escala simétrica: ${
    Math.abs(mapping.pxPerCmX - mapping.pxPerCmY) < 0.5 ? 'SIM' : 'NÃO (distorção detectada)'
  }

EXEMPLOS DE CONVERSÃO:
  • 100px no SVG = ${(100 / mapping.pxPerCmX).toFixed(1)} cm na largura
  • 50px no SVG = ${(50 / mapping.pxPerCmY).toFixed(1)} cm no comprimento
  • Fonte 24px = aproximadamente ${CoordinateScaler.calculatePrintFontSize(24, mapping).toFixed(1)} pt para impressão
═════════════════════════════════════════
    `
  }
}
