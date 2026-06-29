import type { ProcessingConfig, SegmentedImage, VectorizedLayer, ColorInfo } from '../types'

export class VectorizationStage {
  static async process(
    segmented: SegmentedImage,
    config: ProcessingConfig
  ): Promise<VectorizedLayer[]> {
    const layers: VectorizedLayer[] = []

    console.log(`✅ Iniciando vetorização de ${segmented.colorReport.length} cores`)

    for (const colorInfo of segmented.colorReport) {
      const mask = segmented.masks.get(colorInfo.hex)
      if (!mask) continue

      try {
        const svg = await this.vectorizeMask(mask, colorInfo, config)
        const pathCount = (svg.match(/<path/g) || []).length

        layers.push({
          color: colorInfo.hex,
          colorInfo,
          svg,
          pathCount,
        })

        console.log(`   ✓ ${colorInfo.label}: ${pathCount} caminhos`)
      } catch (error) {
        console.error(`   ✗ Erro ao vetorizar ${colorInfo.label}:`, error)
      }
    }

    console.log(`✅ Vetorização completa: ${layers.length} camadas`)

    return layers
  }

  private static async vectorizeMask(
    maskCanvas: HTMLCanvasElement,
    colorInfo: ColorInfo,
    config: ProcessingConfig
  ): Promise<string> {
    // Extrai contornos manualmente (já que Potrace pode não estar disponível no browser)
    return this.traceMaskToSVG(maskCanvas, colorInfo, config)
  }

  private static traceMaskToSVG(
    maskCanvas: HTMLCanvasElement,
    colorInfo: ColorInfo,
    config: ProcessingConfig
  ): string {
    const width = maskCanvas.width
    const height = maskCanvas.height
    const ctx = maskCanvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // Cria mapa binário
    const binaryMap = new Uint8Array(width * height)
    for (let i = 3; i < data.length; i += 4) {
      const pixelIndex = i / 4
      binaryMap[pixelIndex] = data[i] > 128 ? 1 : 0
    }

    // Detecta contornos usando Moore-Neighbor tracing
    const contours = this.detectContours(binaryMap, width, height)

    // Converte contornos para SVG paths
    const paths = contours.map((contourGroup) => {
      const pathData = this.contourToPath(contourGroup[0] as unknown as Array<[number, number]>)
      return `<path d="${pathData}" fill="${colorInfo.hex}" stroke="none"/>`
    })

    // Cria SVG
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${paths.join('\n')}
    </svg>`
  }

  private static detectContours(
    binaryMap: Uint8Array,
    width: number,
    height: number
  ): Array<Array<[number, number]>> {
    const contours: Array<Array<[number, number]>> = []
    const visited = new Uint8Array(width * height)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x
        if (binaryMap[idx] === 1 && visited[idx] === 0) {
          const contour = this.traceContour(binaryMap, width, height, x, y, visited)
          if (contour.length > 3) {
            contours.push(contour)
          }
        }
      }
    }

    return contours
  }

  private static traceContour(
    binaryMap: Uint8Array,
    width: number,
    height: number,
    startX: number,
    startY: number,
    visited: Uint8Array
  ): Array<[number, number]> {
    const contour: Array<[number, number]> = []
    let x = startX
    let y = startY
    let direction = 0 // 0-7 para 8 direções

    const directions = [
      [1, 0],  // E
      [1, 1],  // SE
      [0, 1],  // S
      [-1, 1], // SW
      [-1, 0], // W
      [-1, -1], // NW
      [0, -1], // N
      [1, -1], // NE
    ]

    do {
      const idx = y * width + x
      visited[idx] = 1
      contour.push([x, y])

      // Encontra próximo ponto
      let found = false
      for (let i = 0; i < 8; i++) {
        const d = (direction + i) % 8
        const [dx, dy] = directions[d]
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nidx = ny * width + nx
          if (binaryMap[nidx] === 1) {
            x = nx
            y = ny
            direction = d
            found = true
            break
          }
        }
      }

      if (!found) break
    } while (x !== startX || y !== startY)

    return contour
  }

  private static contourToPath(contour: Array<[number, number]>): string {
    if (contour.length === 0) return ''

    const simplified = this.simplifyContour(contour, 2)
    const bezier = this.fitBezierCurves(simplified)

    let path = `M ${bezier[0][0]} ${bezier[0][1]}`
    for (let i = 1; i < bezier.length; i++) {
      const [x, y] = bezier[i]
      path += ` L ${x} ${y}`
    }
    path += ' Z'

    return path
  }

  private static simplifyContour(
    contour: Array<[number, number]>,
    epsilon: number
  ): Array<[number, number]> {
    // Douglas-Peucker simplification (versão simples)
    if (contour.length < 3) return contour

    const simplified: Array<[number, number]> = [contour[0]]

    for (let i = 1; i < contour.length - 1; i++) {
      const p0 = contour[i - 1] as [number, number]
      const p1 = contour[i] as [number, number]
      const p2 = contour[i + 1] as [number, number]

      const dist = this.perpendiculardistance(p0, p1, p2)
      if (dist > epsilon) {
        simplified.push(p1)
      }
    }

    simplified.push(contour[contour.length - 1] as [number, number])
    return simplified
  }

  private static perpendiculardistance(
    p0: [number, number],
    p1: [number, number],
    p2: [number, number]
  ): number {
    const dx = p2[0] - p0[0]
    const dy = p2[1] - p0[1]
    const num = Math.abs(dy * p1[0] - dx * p1[1] + p2[0] * p0[1] - p2[1] * p0[0])
    const den = Math.sqrt(dy * dy + dx * dx)
    return den === 0 ? 0 : num / den
  }

  private static fitBezierCurves(
    points: Array<[number, number]>
  ): Array<[number, number]> {
    // Simplificado: apenas retorna pontos
    return points
  }
}
