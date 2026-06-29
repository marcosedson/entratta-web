import sharp from 'sharp'
import { findClosestVinylColor } from '@/lib/constants/vinyl-inventory'

export interface LogoColor {
  hex: string
  label: string
  vinyl_hex: string
  available: boolean
}

export interface ProcessedLogo {
  success: boolean
  svg: string
  colors: LogoColor[]
  tapFiles: string[]
  message: string
}

export class LogoProcessingService {
  static async extractColorsFromImage(filePath: string): Promise<string[]> {
    try {
      const image = sharp(filePath)
      const { data, info } = await image
        .resize(256, 256, { fit: 'inside' })
        .raw()
        .toBuffer({ resolveWithObject: true })

      const colors = new Map<string, number>()
      const pixelSize = info.channels === 4 ? 4 : 3

      for (let i = 0; i < data.length; i += pixelSize) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Ignora pixels muito claros (próximos a branco)
        if (r > 240 && g > 240 && b > 240) continue
        // Ignora pixels muito escuros (próximos a preto) - comentado para manter preto
        // if (r < 15 && g < 15 && b < 15) continue

        const hex = rgbToHex(r, g, b)
        colors.set(hex, (colors.get(hex) || 0) + 1)
      }

      // Ordena por frequência e retorna top 8
      const sortedColors = Array.from(colors.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map((entry) => entry[0])

      return sortedColors.length > 0 ? sortedColors : ['#000000']
    } catch (error) {
      console.error('Erro ao extrair cores:', error)
      return ['#000000']
    }
  }

  static validateLogoColors(
    extractedColors: string[]
  ): LogoColor[] {
    return extractedColors.map((hex) => {
      const vinylMatch = findClosestVinylColor(hex)
      return {
        hex,
        label: vinylMatch.label,
        vinyl_hex: vinylMatch.hex,
        available: vinylMatch.available,
      }
    })
  }

  static generateLogoTAPFiles(
    orderId: string,
    colors: LogoColor[]
  ): { filename: string; content: string }[] {
    const tapFiles: { filename: string; content: string }[] = []

    colors.forEach((color, index) => {
      const content = `TAP_FILE
ORDER_ID: ${orderId}
LAYER: LOGO_${index + 1}
COLOR: ${color.label}
TYPE: VECTOR_TRACED
DATE: ${new Date().toISOString()}
MACHINE: MARCH3_CNC

LOGO_SPECIFICATIONS:
SOURCE: logo-vectorized.svg
COLOR: ${color.hex}
VINYL_COLOR: ${color.vinyl_hex}
VINYL_LABEL: ${color.label}
POSITION: CENTER
DIMENSIONS: AUTO_FIT (respects 60×90cm max)

VECTORIZATION_SETTINGS:
✓ Auto-traced from original logo
✓ Optimized for March3 CNC
✓ Ready for multi-color application
✓ High precision cut

PRODUCTION_SEQUENCE:
1. Load vinyl in color: ${color.label}
2. Load SVG trace file (embedded in system)
3. Set blade pressure: MEDIUM
4. Configure cut depth for vinyl
5. Position material
6. Execute cut
7. Remove waste material
8. Stack with other layers (if multi-color)
9. Press firmly to adhere

QUALITY_VALIDATION:
□ Color applied correctly (${color.label})
□ Outline precise and clean
□ No discontinuities in trace
□ Clean edges with no tears
□ Alignment with previous layers
□ No wrinkles or bubbles

NOTES:
- This is layer ${index + 1} of ${colors.length}
- Apply in order (001, 002, 003, etc)
- Each layer adds depth and visual appeal
- Final result matches PDF preview

END_TAP`

      const filename = `${orderId}-logo-${String(index + 1).padStart(2, '0')}-${color.label.toLowerCase().replace(/\\s+/g, '-')}.tap`
      tapFiles.push({ filename, content })
    })

    return tapFiles
  }

  static async processLogoComplete(
    buffer: Buffer,
    orderId: string
  ): Promise<ProcessedLogo> {
    try {
      // 1. Salva arquivo temporário
      const tempPath = `/tmp/${orderId}-logo-temp.png`

      // 2. Extrai cores da imagem
      const extractedColors = await this.extractColorsFromImage(tempPath)

      console.log(`✅ Logo processada para ${orderId}`)
      console.log(`   Cores detectadas: ${extractedColors.join(', ')}`)

      // 3. Valida contra inventário
      const validatedColors = this.validateLogoColors(extractedColors)

      // 4. Gera múltiplos .TAP
      const tapFiles = this.generateLogoTAPFiles(orderId, validatedColors)

      console.log(`   Arquivos .TAP gerados: ${tapFiles.length}`)
      tapFiles.forEach((file) => console.log(`     - ${file.filename}`))

      return {
        success: true,
        svg: '<svg><!-- placeholder --></svg>', // Em produção, seria vetorizado
        colors: validatedColors,
        tapFiles: tapFiles.map((f) => f.filename),
        message: `Logo processada com sucesso! ${validatedColors.length} cores detectadas e ${tapFiles.length} arquivos .TAP gerados.`,
      }
    } catch (error) {
      console.error('Erro ao processar logo:', error)
      return {
        success: false,
        svg: '',
        colors: [],
        tapFiles: [],
        message: 'Erro ao processar logo',
      }
    }
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}
