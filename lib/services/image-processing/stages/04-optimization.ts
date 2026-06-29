import type { ProcessingConfig, VectorizedLayer, SVGLayer } from '../types'

export class OptimizationStage {
  static async process(
    layers: VectorizedLayer[],
    config: ProcessingConfig
  ): Promise<SVGLayer[]> {
    const optimized: SVGLayer[] = []

    console.log(`✅ Otimizando ${layers.length} camadas`)

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i]

      // Remove caminhos redundantes
      const optimizedSvg = this.optimizeSVG(layer.svg)

      // Valida contra inventário
      const vinyl = layer.colorInfo.vinyl_id ? layer.colorInfo.vinyl_id : 'unknown'

      optimized.push({
        id: vinyl,
        color: layer.color,
        label: layer.colorInfo.label,
        svg: optimizedSvg,
        confidence: layer.colorInfo.confidence,
      })
    }

    console.log(`✅ Otimização completa`)

    return optimized
  }

  private static optimizeSVG(svg: string): string {
    // Remove espaços em branco desnecessários
    let optimized = svg.replace(/\s+/g, ' ')

    // Remove comentários
    optimized = optimized.replace(/<!--.*?-->/g, '')

    // Simplifica paths (reduz precisão decimal)
    optimized = optimized.replace(/(\d+\.\d{5,})/g, (match) => {
      return parseFloat(match).toFixed(2)
    })

    // Remove atributos desnecessários
    optimized = optimized.replace(/\s+(id|class|data-.*?)="[^"]*"/g, '')

    return optimized
  }
}
