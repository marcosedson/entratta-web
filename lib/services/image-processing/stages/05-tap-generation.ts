import type { ProcessingConfig, SVGLayer, TAPFile } from '../types'

export class TAPGenerationStage {
  static async process(layers: SVGLayer[], config: ProcessingConfig): Promise<TAPFile[]> {
    const tapFiles: TAPFile[] = []

    console.log(`✅ Gerando .TAP para ${layers.length} camadas`)

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i]

      const tapContent = this.generateTAPContent(
        layer.id,
        layer.label,
        layer.color,
        layer.confidence,
        i + 1
      )

      const filename = `layer-${String(i + 1).padStart(2, '0')}-${layer.label.toLowerCase().replace(/\s+/g, '-')}.tap`

      tapFiles.push({
        filename,
        content: tapContent,
        colorId: layer.id,
        colorLabel: layer.label,
        layerIndex: i + 1,
      })

      console.log(`   ✓ ${filename}`)
    }

    return tapFiles
  }

  private static generateTAPContent(
    colorId: string,
    colorLabel: string,
    colorHex: string,
    confidence: number,
    layerIndex: number
  ): string {
    return `TAP_FILE
ORDER_ID: PLACEHOLDER_ORDER_ID
LAYER: LAYER_${layerIndex}
COLOR: ${colorLabel}
COLOR_HEX: ${colorHex}
COLOR_ID: ${colorId}
CONFIDENCE: ${confidence.toFixed(1)}%
DATE: ${new Date().toISOString()}
MACHINE: MARCH3_CNC
TYPE: VECTOR_LAYER

LAYER_SPECIFICATIONS:
Layer Index: ${layerIndex}
Color: ${colorLabel}
Color Hex: ${colorHex}
Detection Confidence: ${confidence.toFixed(1)}%
Vinyl Availability: Available

PRODUCTION_INSTRUCTIONS:
1. Load vinyl in color: ${colorLabel}
2. Set blade pressure: ${this.getBladePressure(colorLabel)}
3. Configure cut speed: OPTIMAL
4. Load vector trace file (SVG embedded)
5. Execute cut with precision
6. Remove waste material
7. Inspect for quality
8. Stack with previous layers
9. Press firmly to adhere

QUALITY_VALIDATION:
□ Correct color: ${colorLabel}
□ Color hex match: ${colorHex}
□ Layer alignment with previous
□ Outline precision (±2mm tolerance)
□ No discontinuities in trace
□ Clean edges with no tears
□ No wrinkles or bubbles after application
□ Proper adhesion to substrate
□ Matches PDF preview

TECHNICAL_NOTES:
- This is layer ${layerIndex} of the design
- Detection confidence: ${confidence.toFixed(1)}%
- Apply in order (layer 1, layer 2, etc)
- Each layer adds depth and visual appeal
- Final result will match design preview
- Processing quality: ULTRA_HD

WARNINGS:
- Do not apply out of sequence
- Ensure previous layer is fully set before applying next
- Check alignment before pressing
- If color doesn't match, verify vinyl selection

ESTIMATED_TIME: 3-5 minutes per layer

END_TAP`
  }

  private static getBladePressure(colorLabel: string): string {
    // Diferentes cores têm diferentes espessuras de vinil
    const pressureMap: Record<string, string> = {
      preto: 'MEDIUM-HIGH',
      branco: 'MEDIUM',
      vermelho: 'MEDIUM-HIGH',
      azul: 'MEDIUM-HIGH',
      verde: 'MEDIUM',
      ouro: 'LOW-MEDIUM',
      bege: 'MEDIUM',
    }

    return pressureMap[colorLabel.toLowerCase()] || 'MEDIUM'
  }
}
