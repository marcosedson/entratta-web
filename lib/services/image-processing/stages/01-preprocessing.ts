import type { ProcessingConfig, PreprocessedImage } from '../types'
import { SuperResolutionUpscaler } from '../utils/super-resolution'

export class PreprocessingStage {
  static async process(
    imageBase64: string,
    config: ProcessingConfig
  ): Promise<PreprocessedImage> {
    // 1. Carrega imagem
    const image = await this.loadImage(imageBase64)

    // 1.5 Super-Resolution para logos pequenas
    let workingImage = image
    if (SuperResolutionUpscaler.shouldUpscale(image.width, image.height)) {
      console.log(`🔍 Logo detectada como pequena (${image.width}×${image.height})`)
      const upscaleFactor = SuperResolutionUpscaler.calculateUpscaleFactor(
        image.width,
        image.height,
        config.quality === 'ultra' ? 600 : 400
      )

      if (upscaleFactor > 1) {
        console.log(`📈 Aplicando super-resolution (${upscaleFactor}x)...`)
        const upscaledCanvas = document.createElement('canvas')
        const ctx = upscaledCanvas.getContext('2d')!
        const imageData = ctx.getImageData(0, 0, image.width, image.height)

        // Usa upscaling progressivo para melhor qualidade
        const upscaledData = SuperResolutionUpscaler.upscaleProgressive(imageData, upscaleFactor)

        upscaledCanvas.width = upscaledData.width
        upscaledCanvas.height = upscaledData.height
        ctx.putImageData(upscaledData, 0, 0)
        workingImage = upscaledCanvas
        console.log(`   ✅ Super-resolution completo: ${upscaledData.width}×${upscaledData.height}`)
      }
    }

    // 2. Redimensiona baseado na qualidade
    const targetDpi = this.getDpiForQuality(config.quality)
    const resized = await this.resizeImage(workingImage, targetDpi)

    // 3. Aplica filtros baseado na qualidade
    if (config.quality === 'high' || config.quality === 'ultra') {
      this.applyContrast(resized)
    }

    if (config.quality === 'ultra') {
      this.applyDenoising(resized)
      this.applyCLAHE(resized)
    }

    console.log(`✅ Preprocessing completo (${config.quality})`)
    console.log(`   Resolução final: ${resized.width}×${resized.height}`)
    console.log(`   DPI: ${targetDpi}`)

    return resized
  }

  private static getDpiForQuality(quality: string): number {
    const dpiMap: Record<string, number> = {
      normal: 150,
      high: 300,
      ultra: 600,
    }
    return dpiMap[quality] || 150
  }

  private static async loadImage(base64: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        resolve(canvas)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = base64
    })
  }

  private static async resizeImage(
    canvas: HTMLCanvasElement,
    targetDpi: number
  ): Promise<PreprocessedImage> {
    const scale = targetDpi / 96 // 96 é DPI padrão do navegador
    const newWidth = Math.round(canvas.width * scale)
    const newHeight = Math.round(canvas.height * scale)

    const newCanvas = document.createElement('canvas')
    newCanvas.width = newWidth
    newCanvas.height = newHeight

    const ctx = newCanvas.getContext('2d')!
    ctx.drawImage(canvas, 0, 0, newWidth, newHeight)

    const data = ctx.getImageData(0, 0, newWidth, newHeight)

    return {
      canvas: newCanvas,
      width: newWidth,
      height: newHeight,
      data,
    }
  }

  private static applyContrast(image: PreprocessedImage): void {
    const data = image.data.data
    const contrast = 1.5
    const intercept = 128 * (1 - contrast) / 2

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] * contrast + intercept)
      data[i + 1] = Math.round(data[i + 1] * contrast + intercept)
      data[i + 2] = Math.round(data[i + 2] * contrast + intercept)
    }

    const ctx = image.canvas.getContext('2d')!
    ctx.putImageData(image.data, 0, 0)
  }

  private static applyDenoising(image: PreprocessedImage): void {
    // Bilateral filter (simples)
    const data = image.data.data
    const { width, height } = image

    const output = new Uint8ClampedArray(data)
    const radius = 2
    const sigmaSpatial = 2
    const sigmaIntensity = 50

    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const idx = (y * width + x) * 4

        let r = 0,
          g = 0,
          b = 0,
          weight = 0

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nidx = ((y + dy) * width + (x + dx)) * 4
            const dist = Math.sqrt(dx * dx + dy * dy)
            const colorDiff =
              Math.abs(data[idx] - data[nidx]) +
              Math.abs(data[idx + 1] - data[nidx + 1]) +
              Math.abs(data[idx + 2] - data[nidx + 2])

            const w =
              Math.exp(-(dist * dist) / (2 * sigmaSpatial * sigmaSpatial)) *
              Math.exp(-(colorDiff * colorDiff) / (2 * sigmaIntensity * sigmaIntensity))

            r += data[nidx] * w
            g += data[nidx + 1] * w
            b += data[nidx + 2] * w
            weight += w
          }
        }

        output[idx] = Math.round(r / weight)
        output[idx + 1] = Math.round(g / weight)
        output[idx + 2] = Math.round(b / weight)
      }
    }

    image.data.data.set(output)
    const ctx = image.canvas.getContext('2d')!
    image.data.data.set(output)
    ctx.putImageData(image.data, 0, 0)
  }

  private static applyCLAHE(image: PreprocessedImage): void {
    // CLAHE - Contrast Limited Adaptive Histogram Equalization
    const { data } = image.data
    const { width, height } = image

    const clipLimit = 40
    const tileSize = 8
    const tilesX = Math.ceil(width / tileSize)
    const tilesY = Math.ceil(height / tileSize)

    // Simplificado: aplica equalization local
    for (let ty = 0; ty < tilesY; ty++) {
      for (let tx = 0; tx < tilesX; tx++) {
        const x1 = tx * tileSize
        const y1 = ty * tileSize
        const x2 = Math.min(x1 + tileSize, width)
        const y2 = Math.min(y1 + tileSize, height)

        this.equalizeTile(image, x1, y1, x2, y2, clipLimit)
      }
    }

    const ctx = image.canvas.getContext('2d')!
    ctx.putImageData(image.data, 0, 0)
  }

  private static equalizeTile(
    image: PreprocessedImage,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    clipLimit: number
  ): void {
    const { data } = image.data
    const { width } = image

    // Calcula histograma do tile
    const hist = new Uint32Array(256)
    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        const idx = (y * width + x) * 4
        const gray = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2])
        hist[gray]++
      }
    }

    // Limita contraste
    const pixelsInTile = (x2 - x1) * (y2 - y1)
    for (let i = 0; i < 256; i++) {
      hist[i] = Math.min(hist[i], Math.round(clipLimit * (pixelsInTile / 256)))
    }
  }
}
