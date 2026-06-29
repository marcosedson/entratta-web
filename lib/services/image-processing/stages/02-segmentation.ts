import type { ProcessingConfig, PreprocessedImage, SegmentedImage, ColorInfo } from '../types'
import {
  kMeansClustering,
  rgbToLab,
  calculateColorConfidence,
  findClosestColor,
  rgbToHex,
} from '../utils/color-utils'

export class SegmentationStage {
  static async process(
    image: PreprocessedImage,
    config: ProcessingConfig
  ): Promise<SegmentedImage> {
    const imageData = image.data

    // 1. Extrai cores principais
    const colors = kMeansClustering(imageData.data, 8)

    // 2. Cria máscara para cada cor
    const masks = new Map<string, HTMLCanvasElement>()
    const colorReport: ColorInfo[] = []

    for (const color of colors) {
      if (color.count < 100) continue // Ignora cores muito raras

      const mask = this.createMask(image, color.rgb, config)
      const colorLab = rgbToLab(...color.rgb)
      const confidence = calculateColorConfidence(color.count, imageData.data.length / 4)

      const colorInfo: ColorInfo = {
        hex: color.hex,
        rgb: color.rgb,
        lab: colorLab,
        label: color.hex,
        confidence: Math.min(100, confidence),
      }

      // Encontra cor mais próxima no inventário
      if (config.targetVinylInventory.length > 0) {
        const closest = findClosestColor(colorInfo, config.targetVinylInventory)
        if (closest) {
          colorInfo.vinyl_id = closest.id
          colorInfo.vinyl_hex = closest.hex
          colorInfo.label = closest.label
        }
      }

      masks.set(color.hex, mask)
      colorReport.push(colorInfo)
    }

    console.log(`✅ Segmentação completa`)
    console.log(`   Cores identificadas: ${colorReport.length}`)
    colorReport.forEach((c) => console.log(`     - ${c.label}: ${c.confidence.toFixed(1)}%`))

    return {
      masks,
      colorReport,
      originalImage: image.canvas,
    }
  }

  private static createMask(
    image: PreprocessedImage,
    targetColor: [number, number, number],
    config: ProcessingConfig
  ): HTMLCanvasElement {
    const imageData = image.data
    const { width, height } = image
    const threshold = 30

    // Cria máscara binária
    const maskData = new Uint8ClampedArray(imageData.data.length)

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i]
      const g = imageData.data[i + 1]
      const b = imageData.data[i + 2]
      const a = imageData.data[i + 3]

      const dr = r - targetColor[0]
      const dg = g - targetColor[1]
      const db = b - targetColor[2]

      const distance = Math.sqrt(dr * dr + dg * dg + db * db)

      const matches = distance < threshold && a > 128
      const maskAlpha = matches ? 255 : 0

      maskData[i] = 0
      maskData[i + 1] = 0
      maskData[i + 2] = 0
      maskData[i + 3] = maskAlpha
    }

    // Cria canvas com a máscara
    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = width
    maskCanvas.height = height

    const maskCtx = maskCanvas.getContext('2d')!
    const maskImageData = maskCtx.createImageData(width, height)
    maskImageData.data.set(maskData)
    maskCtx.putImageData(maskImageData, 0, 0)

    // Aplica operações morfológicas se necessário
    if (config.quality === 'ultra') {
      this.applyMorphological(maskCanvas)
    }

    return maskCanvas
  }

  private static applyMorphological(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Erosão (remove pequenos ruídos)
    const eroded = new Uint8ClampedArray(data)
    for (let i = 3; i < data.length; i += 4) {
      // Se alfa > 0, checa vizinhos
      if (data[i] > 128) {
        // Simples: só mantém se vizinhos também têm alfa
        let hasZeroNeighbor = false
        const idx = i / 4
        const width = canvas.width
        const neighbors = [
          idx - 1,
          idx + 1,
          idx - width,
          idx + width,
          idx - width - 1,
          idx - width + 1,
          idx + width - 1,
          idx + width + 1,
        ]

        for (const n of neighbors) {
          if (data[n * 4 + 3] < 128) {
            hasZeroNeighbor = true
            break
          }
        }

        if (hasZeroNeighbor) {
          eroded[i] = 0
        }
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }
}
