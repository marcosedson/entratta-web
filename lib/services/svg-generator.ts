import type { ConfiguratorState } from '@/lib/hooks'
import { MEASUREMENTS, CARPET_COLORS, TEXT_COLORS, BORDER_COLORS, BORDERS } from '@/lib/constants'

export class SVGGenerator {
  /**
   * Gera SVG vetorial pronto para CorelDraw
   */
  static generateSVG(
    state: ConfiguratorState,
    logoBase64?: string,
    orderId: string = 'ENTRATTA'
  ): string {
    const measurement = MEASUREMENTS[state.medida]
    if (!measurement) return ''

    // Dimensões em milímetros para SVG (1cm = 10mm, 1mm = 2.834646px no padrão de print)
    const widthMm = measurement.w * 10 * 100 // em milímetros
    const heightMm = measurement.c * 10 * 100

    // Para visualização, escala a 1/10 para caber na tela
    const scale = 0.5
    const widthSvg = widthMm * scale
    const heightSvg = heightMm * scale

    const colors = {
      carpet: CARPET_COLORS.find((c) => c.id === state.corTapete),
      text: TEXT_COLORS.find((c) => c.id === state.corTexto),
      border: BORDER_COLORS.find((c) => c.id === state.corBorda),
      borderObj: BORDERS.find((b) => b.id === state.borda),
    }

    // Começa SVG
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${widthSvg + 100}" height="${heightSvg + 100}"
     viewBox="0 0 ${widthSvg + 100} ${heightSvg + 100}"
     version="1.1">
  <defs>
    <style type="text/css">
      .tape-bg { fill: ${colors.carpet?.hex || '#CCCCCC'}; }
      .tape-border { stroke: ${colors.border?.hex || '#000000'}; fill: none; }
      .tape-text { font-family: Arial, sans-serif; font-weight: bold; fill: ${colors.text?.hex || '#000000'}; }
      .dimension-line { stroke: #666666; stroke-width: 0.5; }
      .dimension-text { font-family: Arial; font-size: 10px; fill: #333333; }
    </style>
  </defs>

  <!-- Fundo de apresentação -->
  <rect width="${widthSvg + 100}" height="${heightSvg + 100}" fill="#F5F5F5"/>

  <!-- Título -->
  <text x="50" y="30" font-size="20" font-weight="bold" fill="#1E3A5F">
    ENTRATTA - Capacho Personalizado
  </text>
  <text x="50" y="50" font-size="12" fill="#666666">
    Pedido: ${orderId} | Medida: ${measurement.l}
  </text>

  <!-- Grupo do tapete -->
  <g transform="translate(50, 70)">
    <!-- Fundo do tapete (cor real) -->
    <rect class="tape-bg" x="0" y="0" width="${widthSvg}" height="${heightSvg}" rx="5" ry="5"/>

    <!-- Borda (se houver) -->
    ${this.generateBorder(colors, widthSvg, heightSvg, scale)}

    <!-- Texto personalizado -->
    ${this.generateText(state, colors, widthSvg, heightSvg)}

    <!-- Logo (se houver) -->
    ${logoBase64 ? this.generateLogo(logoBase64, widthSvg, heightSvg) : ''}

    <!-- Linhas de dimensão -->
    ${this.generateDimensionLines(colors, widthSvg, heightSvg, measurement, scale)}
  </g>

  <!-- Legenda de cores -->
  ${this.generateLegend(colors, widthSvg, orderId)}

  <!-- Metadata -->
  <metadata>
    <creator>ENTRATTA SVG Generator</creator>
    <date>${new Date().toISOString()}</date>
    <orderId>${orderId}</orderId>
    <dimensions>${measurement.w}cm x ${measurement.c}cm</dimensions>
    <carpet-color>${colors.carpet?.hex || 'N/A'}</carpet-color>
    <text-color>${colors.text?.hex || 'N/A'}</text-color>
    <border-color>${colors.border?.hex || 'N/A'}</border-color>
    <text-content>${state.texto || 'Sem texto'}</text-content>
  </metadata>
</svg>`

    return svg
  }

  private static generateBorder(
    colors: any,
    widthSvg: number,
    heightSvg: number,
    scale: number
  ): string {
    if (!colors.borderObj || colors.borderObj.id === 'sem') return ''

    const borderWidth = colors.borderObj.id === 'fina' ? 2 * scale : 4 * scale

    if (colors.borderObj.id === 'dupla') {
      return `
    <!-- Borda dupla externa -->
    <rect class="tape-border" x="0" y="0" width="${widthSvg}" height="${heightSvg}"
          stroke-width="${borderWidth}" rx="5" ry="5"/>
    <!-- Borda dupla interna -->
    <rect class="tape-border" x="${borderWidth * 2}" y="${borderWidth * 2}"
          width="${widthSvg - borderWidth * 4}" height="${heightSvg - borderWidth * 4}"
          stroke-width="${borderWidth / 2}" rx="3" ry="3"/>`
    } else {
      return `
    <!-- Borda simples -->
    <rect class="tape-border" x="0" y="0" width="${widthSvg}" height="${heightSvg}"
          stroke-width="${borderWidth}" rx="5" ry="5"/>`
    }
  }

  private static generateText(
    state: ConfiguratorState,
    colors: any,
    widthSvg: number,
    heightSvg: number
  ): string {
    if (!state.texto) return ''

    const fontSize = Math.min(widthSvg / 6, 60) // Tamanho responsivo
    const x = widthSvg / 2
    const y = heightSvg / 2 + fontSize / 3

    return `
    <!-- Texto personalizado -->
    <text class="tape-text" x="${x}" y="${y}"
          font-size="${fontSize}"
          text-anchor="middle"
          dominant-baseline="middle">
      ${state.texto.toUpperCase()}
    </text>`
  }

  private static generateLogo(logoBase64: string, widthSvg: number, heightSvg: number): string {
    const logoWidth = widthSvg * 0.25
    const logoHeight = heightSvg * 0.3
    const x = widthSvg - logoWidth - 10
    const y = 10

    return `
    <!-- Logo -->
    <image x="${x}" y="${y}" width="${logoWidth}" height="${logoHeight}"
           xlink:href="${logoBase64}"
           preserveAspectRatio="xMidYMid meet"
           opacity="0.8"/>`
  }

  private static generateDimensionLines(
    colors: any,
    widthSvg: number,
    heightSvg: number,
    measurement: any,
    scale: number
  ): string {
    const lineOffset = 20

    return `
    <!-- Dimensões -->
    <!-- Linha horizontal (largura) -->
    <line class="dimension-line" x1="-${lineOffset}" y1="${heightSvg + lineOffset}"
          x2="${widthSvg + lineOffset}" y2="${heightSvg + lineOffset}"/>
    <line class="dimension-line" x1="-${lineOffset / 2}" y1="${heightSvg + lineOffset - 5}"
          x2="-${lineOffset / 2}" y2="${heightSvg + lineOffset + 5}"/>
    <line class="dimension-line" x1="${widthSvg + lineOffset / 2}" y1="${heightSvg + lineOffset - 5}"
          x2="${widthSvg + lineOffset / 2}" y2="${heightSvg + lineOffset + 5}"/>
    <text class="dimension-text" x="${widthSvg / 2}" y="${heightSvg + lineOffset + 20}"
          text-anchor="middle">${measurement.w} cm</text>

    <!-- Linha vertical (comprimento) -->
    <line class="dimension-line" x1="${widthSvg + lineOffset}" y1="-${lineOffset}"
          x2="${widthSvg + lineOffset}" y2="${heightSvg + lineOffset}"/>
    <line class="dimension-line" x1="${widthSvg + lineOffset - 5}" y1="-${lineOffset / 2}"
          x2="${widthSvg + lineOffset + 5}" y2="-${lineOffset / 2}"/>
    <line class="dimension-line" x1="${widthSvg + lineOffset - 5}" y1="${heightSvg + lineOffset / 2}"
          x2="${widthSvg + lineOffset + 5}" y2="${heightSvg + lineOffset / 2}"/>
    <text class="dimension-text" x="${widthSvg + lineOffset + 30}" y="${heightSvg / 2}"
          text-anchor="start">${measurement.c} cm</text>`
  }

  private static generateLegend(colors: any, widthSvg: number, orderId: string): string {
    const yStart = 70 + widthSvg * 0.5 + 150

    return `
  <!-- Legenda -->
  <g transform="translate(50, ${yStart})">
    <text font-size="14" font-weight="bold" fill="#1E3A5F">CORES UTILIZADAS:</text>

    <!-- Fundo -->
    <rect x="0" y="20" width="15" height="15" fill="${colors.carpet?.hex || '#CCCCCC'}" stroke="#333" stroke-width="0.5"/>
    <text x="20" y="32" font-size="12" fill="#333333">Fundo: ${colors.carpet?.label || 'Indefinido'}</text>

    <!-- Texto -->
    <rect x="250" y="20" width="15" height="15" fill="${colors.text?.hex || '#000000'}" stroke="#333" stroke-width="0.5"/>
    <text x="270" y="32" font-size="12" fill="#333333">Texto: ${colors.text?.label || 'Indefinido'}</text>

    <!-- Borda -->
    ${
      colors.borderObj && colors.borderObj.id !== 'sem'
        ? `<rect x="450" y="20" width="15" height="15" fill="${colors.border?.hex || '#000000'}" stroke="#333" stroke-width="0.5"/>
    <text x="470" y="32" font-size="12" fill="#333333">Borda: ${colors.border?.label || 'Indefinido'}</text>`
        : ''
    }

    <!-- Info -->
    <text x="0" y="60" font-size="11" fill="#666666">
      Gerado por ENTRATTA | ${new Date().toLocaleDateString('pt-BR')} | Pedido: ${orderId}
    </text>
  </g>`
  }
}
