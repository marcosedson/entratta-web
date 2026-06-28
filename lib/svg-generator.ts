// Função para gerar SVGs separados por cor

interface TextElement {
  id: string
  content: string
  color: string
  fontSize: number
  posX: number
  posY: number
  fontFamily: 'bold' | 'light' | 'serif'
}

interface LogoElement {
  id: string
  src: string | null
  scale: number
  posX: number
  posY: number
  removeBackground: boolean
}

interface BorderConfig {
  type: 'none' | 'thin' | 'double' | 'embossed_5cm'
  color: string
}

interface SvgConfig {
  medida: string
  corTapete: string
  border: BorderConfig
  textos: TextElement[]
  logos: LogoElement[]
}

export const CORES: Record<string, string> = {
  preto: '#1a1a1a',
  cinza: '#4a4a4a',
  verde: '#15803D',
  azul: '#0F2D52',
  vermelho: '#991B1B',
  marrom: '#78350F',
  branco: '#FFFFFF',
  dourado: '#B8860B',
}

export const MEDIDAS: Record<string, { w: number; c: number }> = {
  '40x60': { w: 0.4, c: 0.6 },
  '60x90': { w: 0.6, c: 0.9 },
  '80x120': { w: 0.8, c: 1.2 },
}

// Tipo para cada cor detectada
interface ColorLayer {
  colorName: string
  colorHex: string
  elementos: {
    textos: TextElement[]
    logos: LogoElement[]
    borda?: BorderConfig
  }
}

/**
 * Detecta todas as cores usadas e agrupa elementos por cor
 */
export function detectColoresYAgrupar(config: SvgConfig): ColorLayer[] {
  const colorMap = new Map<string, ColorLayer>()

  // 1. Adiciona borda se existir
  if (config.border.type !== 'none') {
    const borderColor = config.border.color
    const borderHex = CORES[borderColor] || '#FFFFFF'
    if (!colorMap.has(borderColor)) {
      colorMap.set(borderColor, {
        colorName: borderColor,
        colorHex: borderHex,
        elementos: { textos: [], logos: [], borda: config.border },
      })
    } else {
      const layer = colorMap.get(borderColor)!
      layer.elementos.borda = config.border
    }
  }

  // 2. Agrupa textos por cor
  config.textos.forEach(texto => {
    const colorHex = CORES[texto.color] || '#FFFFFF'
    if (!colorMap.has(texto.color)) {
      colorMap.set(texto.color, {
        colorName: texto.color,
        colorHex: colorHex,
        elementos: { textos: [texto], logos: [] },
      })
    } else {
      colorMap.get(texto.color)!.elementos.textos.push(texto)
    }
  })

  // 3. Agrupa logos por cor (preto por padrão, ou detectar mais tarde)
  config.logos.forEach(logo => {
    const logoColor = 'preto' // Default: logos em preto
    const colorHex = CORES[logoColor]
    if (!colorMap.has(logoColor)) {
      colorMap.set(logoColor, {
        colorName: logoColor,
        colorHex: colorHex,
        elementos: { textos: [], logos: [logo] },
      })
    } else {
      colorMap.get(logoColor)!.elementos.logos.push(logo)
    }
  })

  // Ordena por sequência: borda -> textos -> logos
  return Array.from(colorMap.values()).sort((a, b) => {
    const ordem: Record<string, number> = {
      branco: 1,
      dourado: 2,
      verde: 3,
      azul: 4,
      vermelho: 5,
      amarelo: 6,
      preto: 7,
    }
    return (ordem[a.colorName] || 99) - (ordem[b.colorName] || 99)
  })
}

/**
 * Gera SVG para uma cor específica
 */
export function gerarSvgPorCor(
  colorLayer: ColorLayer,
  config: SvgConfig,
  svgWidth: number = 400
): string {
  const medida = MEDIDAS[config.medida]
  const svgHeight = Math.round(svgWidth / (medida.w / medida.c))

  const borderColorHex = CORES[config.border.color] || '#FFFFFF'

  // Inicia SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <!-- Cor: ${colorLayer.colorName.toUpperCase()} (${colorLayer.colorHex}) -->
  
`

  // Adiciona borda se pertence a esta cor
  if (colorLayer.elementos.borda) {
    const border = colorLayer.elementos.borda
    if (border.type === 'thin') {
      svg += `  <rect x="10" y="10" width="${svgWidth - 20}" height="${svgHeight - 20}" fill="none" stroke="${colorLayer.colorHex}" stroke-width="2" />\n`
    } else if (border.type === 'double') {
      svg += `  <rect x="8" y="8" width="${svgWidth - 16}" height="${svgHeight - 16}" fill="none" stroke="${colorLayer.colorHex}" stroke-width="3" />\n`
      svg += `  <rect x="15" y="15" width="${svgWidth - 30}" height="${svgHeight - 30}" fill="none" stroke="${colorLayer.colorHex}" stroke-width="1" />\n`
    } else if (border.type === 'embossed_5cm') {
      svg += `  <rect x="20" y="20" width="${svgWidth - 40}" height="${svgHeight - 40}" fill="none" stroke="${colorLayer.colorHex}" stroke-width="8" rx="4" opacity="0.5" />\n`
    }
  }

  // Adiciona textos
  if (colorLayer.elementos.textos.length > 0) {
    colorLayer.elementos.textos.forEach(texto => {
      const x = (svgWidth * texto.posX) / 100
      const y = (svgHeight * texto.posY) / 100
      const fontSize = 12 * texto.fontSize
      const fontWeight = texto.fontFamily === 'bold' ? 'bold' : 'normal'
      const fontFamily = texto.fontFamily === 'serif' ? 'Georgia' : 'Arial'

      svg += `  <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="${colorLayer.colorHex}" font-size="${fontSize}" font-weight="${fontWeight}" font-family="${fontFamily}">${texto.content}</text>\n`
    })
  }

  // Nota: Logos com base64 não incluimos no SVG mock (complexo demais)
  // Em produção, seria mais simples referir a arquivo externo

  svg += `</svg>`

  return svg
}

/**
 * Gera lista de todas as cores com seus arquivos correspondentes
 */
export function listarCoresOrdenadas(config: SvgConfig): Array<{
  numero: number
  nome: string
  hex: string
  elemento: string
}> {
  const colors = detectColoresYAgrupar(config)
  return colors.map((layer, idx) => ({
    numero: idx + 1,
    nome: layer.colorName.toUpperCase(),
    hex: layer.colorHex,
    elemento: layer.elementos.borda ? 'borda' : layer.elementos.textos.length > 0 ? 'texto' : 'logo',
  }))
}

