import type { PreprocessedImage } from '../types'

export class SuperResolutionUpscaler {
  /**
   * Detecta se imagem é pequena e precisa de upscaling
   * @param width Largura em pixels
   * @param height Altura em pixels
   * @returns true se imagem é pequena
   */
  static shouldUpscale(width: number, height: number): boolean {
    const minDimension = Math.min(width, height)
    return minDimension < 200
  }

  /**
   * Calcula fator de upscaling ideal
   * @param width Largura atual
   * @param height Altura atual
   * @param targetMinDimension Dimensão mínima alvo (padrão: 400)
   * @returns Fator de multiplicação (ex: 2.0 para 2x)
   */
  static calculateUpscaleFactor(
    width: number,
    height: number,
    targetMinDimension: number = 400
  ): number {
    const minDimension = Math.min(width, height)
    if (minDimension >= targetMinDimension) return 1.0

    // Upscale até atingir o mínimo (ou máximo de 4x)
    const factor = Math.min(4.0, Math.ceil((targetMinDimension / minDimension) * 2) / 2)
    return Math.max(1.0, factor)
  }

  /**
   * Upscaling de alta qualidade usando interpolação bicúbica
   * @param imageData Imagem original
   * @param scaleFactor Fator de multiplicação
   * @returns Imagem upscaled
   */
  static upscaleBicubic(imageData: ImageData, scaleFactor: number): ImageData {
    if (scaleFactor <= 1) return imageData

    const srcWidth = imageData.width
    const srcHeight = imageData.height
    const dstWidth = Math.round(srcWidth * scaleFactor)
    const dstHeight = Math.round(srcHeight * scaleFactor)

    const dstData = new Uint8ClampedArray(dstWidth * dstHeight * 4)

    console.log(`🔍 Upscaling: ${srcWidth}×${srcHeight} → ${dstWidth}×${dstHeight} (${scaleFactor}x)`)

    for (let y = 0; y < dstHeight; y++) {
      for (let x = 0; x < dstWidth; x++) {
        // Calcula posição na imagem original
        const srcX = x / scaleFactor
        const srcY = y / scaleFactor

        // Obtém valor interpolado usando bicúbica
        const rgba = this.sampleBicubic(imageData, srcX, srcY)

        // Escreve no destino
        const dstIdx = (y * dstWidth + x) * 4
        dstData[dstIdx] = rgba[0]
        dstData[dstIdx + 1] = rgba[1]
        dstData[dstIdx + 2] = rgba[2]
        dstData[dstIdx + 3] = rgba[3]
      }
    }

    return new ImageData(dstData, dstWidth, dstHeight)
  }

  /**
   * Upscaling progressivo: primeiro passa interpolação linear, depois bicúbica
   * Mais rápido que bicúbica pura para grandes factores
   */
  static upscaleProgressive(imageData: ImageData, targetFactor: number): ImageData {
    if (targetFactor <= 1) return imageData

    console.log(`📈 Upscaling progressivo: ${targetFactor}x`)

    let current = imageData
    let remainingFactor = targetFactor

    // Primeira passada: 2x com interpolação rápida
    if (remainingFactor >= 2) {
      console.log(`   → Passada 1: 2x linear`)
      current = this.upscaleLinear(current, 2)
      remainingFactor /= 2
    }

    // Segunda passada: restante com bicúbica
    if (remainingFactor > 1) {
      console.log(`   → Passada 2: ${remainingFactor.toFixed(2)}x bicúbica`)
      current = this.upscaleBicubic(current, remainingFactor)
    }

    return current
  }

  /**
   * Upscaling linear simples (mais rápido)
   */
  static upscaleLinear(imageData: ImageData, scaleFactor: number): ImageData {
    if (scaleFactor <= 1) return imageData

    const srcWidth = imageData.width
    const srcHeight = imageData.height
    const dstWidth = Math.round(srcWidth * scaleFactor)
    const dstHeight = Math.round(srcHeight * scaleFactor)

    const dstData = new Uint8ClampedArray(dstWidth * dstHeight * 4)

    for (let y = 0; y < dstHeight; y++) {
      for (let x = 0; x < dstWidth; x++) {
        const srcX = x / scaleFactor
        const srcY = y / scaleFactor

        const rgba = this.sampleLinear(imageData, srcX, srcY)

        const dstIdx = (y * dstWidth + x) * 4
        dstData[dstIdx] = rgba[0]
        dstData[dstIdx + 1] = rgba[1]
        dstData[dstIdx + 2] = rgba[2]
        dstData[dstIdx + 3] = rgba[3]
      }
    }

    return new ImageData(dstData, dstWidth, dstHeight)
  }

  /**
   * Amostragem linear (bilinear interpolation)
   */
  private static sampleLinear(
    imageData: ImageData,
    x: number,
    y: number
  ): [number, number, number, number] {
    const width = imageData.width
    const height = imageData.height
    const data = imageData.data

    // Clamp coordenadas
    x = Math.max(0, Math.min(width - 1, x))
    y = Math.max(0, Math.min(height - 1, y))

    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const fx = x - xi
    const fy = y - yi

    // Pixels vizinhos
    const p00 = this.getPixel(data, width, xi, yi)
    const p10 = this.getPixel(data, width, xi + 1, yi)
    const p01 = this.getPixel(data, width, xi, yi + 1)
    const p11 = this.getPixel(data, width, xi + 1, yi + 1)

    // Interpolação linear
    const r =
      p00[0] * (1 - fx) * (1 - fy) +
      p10[0] * fx * (1 - fy) +
      p01[0] * (1 - fx) * fy +
      p11[0] * fx * fy

    const g =
      p00[1] * (1 - fx) * (1 - fy) +
      p10[1] * fx * (1 - fy) +
      p01[1] * (1 - fx) * fy +
      p11[1] * fx * fy

    const b =
      p00[2] * (1 - fx) * (1 - fy) +
      p10[2] * fx * (1 - fy) +
      p01[2] * (1 - fx) * fy +
      p11[2] * fx * fy

    const a =
      p00[3] * (1 - fx) * (1 - fy) +
      p10[3] * fx * (1 - fy) +
      p01[3] * (1 - fx) * fy +
      p11[3] * fx * fy

    return [Math.round(r), Math.round(g), Math.round(b), Math.round(a)]
  }

  /**
   * Amostragem bicúbica (melhor qualidade)
   */
  private static sampleBicubic(
    imageData: ImageData,
    x: number,
    y: number
  ): [number, number, number, number] {
    const width = imageData.width
    const height = imageData.height
    const data = imageData.data

    x = Math.max(0, Math.min(width - 1, x))
    y = Math.max(0, Math.min(height - 1, y))

    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const fx = x - xi
    const fy = y - yi

    // 16 pixels para bicúbica
    const pixels: Array<[number, number, number, number]> = []
    for (let dy = -1; dy <= 2; dy++) {
      for (let dx = -1; dx <= 2; dx++) {
        pixels.push(this.getPixel(data, width, xi + dx, yi + dy))
      }
    }

    // Coeficientes de interpolação bicúbica (Catmull-Rom)
    const kx = [this.cubic(fx + 1), this.cubic(fx), this.cubic(fx - 1), this.cubic(fx - 2)]
    const ky = [this.cubic(fy + 1), this.cubic(fy), this.cubic(fy - 1), this.cubic(fy - 2)]

    let r = 0,
      g = 0,
      b = 0,
      a = 0

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const idx = i * 4 + j
        const w = kx[j] * ky[i]

        r += pixels[idx][0] * w
        g += pixels[idx][1] * w
        b += pixels[idx][2] * w
        a += pixels[idx][3] * w
      }
    }

    return [Math.round(r), Math.round(g), Math.round(b), Math.round(a)]
  }

  /**
   * Função cúbica de Catmull-Rom
   */
  private static cubic(t: number): number {
    const a = -0.5
    const absT = Math.abs(t)

    if (absT < 1) {
      return 1 + absT * absT * (a * 2 - 3) + Math.pow(absT, 3) * (2 - a)
    } else if (absT < 2) {
      return a * (4 - absT * (8 + absT * (5 - absT)))
    } else {
      return 0
    }
  }

  /**
   * Obtém pixel com boundary clamping
   */
  private static getPixel(
    data: Uint8ClampedArray,
    width: number,
    x: number,
    y: number
  ): [number, number, number, number] {
    x = Math.max(0, Math.min(width - 1, Math.floor(x)))
    y = Math.max(0, Math.min(Math.floor(data.length / (width * 4)) - 1, Math.floor(y)))

    const idx = (y * width + x) * 4
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]]
  }
}
