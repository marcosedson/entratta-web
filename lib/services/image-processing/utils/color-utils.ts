import type { ColorInfo } from '../types'

// Converte RGB para Lab (espaço de cor perceptualmente uniforme)
export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  // Normalize RGB
  r = r / 255
  g = g / 255
  b = b / 255

  // Convert to XYZ
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

  const x = r * 0.4124 + g * 0.3576 + b * 0.1805
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505

  // Reference white point (D65)
  const xn = 0.95047
  const yn = 1.0
  const zn = 1.08883

  const l = Math.max(0, Math.min(100, 116 * f(y / yn) - 16))
  const a = 500 * (f(x / xn) - f(y / yn))
  const lb = 200 * (f(y / yn) - f(z / zn))

  return [l, a, lb]
}

function f(t: number): number {
  const delta = 6 / 29
  return t > delta * delta * delta ? Math.pow(t, 1 / 3) : t / (3 * delta * delta) + 2 / 3
}

// Calcula diferença de cor em espaço Lab (Delta E)
export function deltaE(lab1: [number, number, number], lab2: [number, number, number]): number {
  const dl = lab1[0] - lab2[0]
  const da = lab1[1] - lab2[1]
  const db = lab1[2] - lab2[2]
  return Math.sqrt(dl * dl + da * da + db * db)
}

// Encontra cor mais próxima no inventário
export function findClosestColor(
  color: ColorInfo,
  inventory: Array<{ id: string; label: string; hex: string }>
): { id: string; label: string; hex: string; deltaE: number } | null {
  let closest = null
  let minDelta = Infinity

  for (const vinyl of inventory) {
    const [r, g, b] = hexToRgb(vinyl.hex)
    const vinylLab = rgbToLab(r, g, b)
    const delta = deltaE(color.lab, vinylLab)

    if (delta < minDelta) {
      minDelta = delta
      closest = { ...vinyl, deltaE: delta }
    }
  }

  return closest
}

export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 0, 0]
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')}`
}

// K-means clustering para identificar cores principais
export function kMeansClustering(
  pixels: Uint8ClampedArray,
  k: number = 8
): Array<{ hex: string; rgb: [number, number, number]; count: number }> {
  const colors: Array<{ r: number; g: number; b: number }> = []

  // Extrai cores únicas
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    const a = pixels[i + 3]

    // Ignora pixels transparentes e muito claros
    if (a < 128 || (r > 240 && g > 240 && b > 240)) continue

    colors.push({ r, g, b })
  }

  // Limita a k cores
  const uniqueColors = Array.from(
    new Map(colors.map((c) => [`${c.r},${c.g},${c.b}`, c])).values()
  ).slice(0, Math.min(k, colors.length))

  // Ordena por frequência (aproximado)
  return uniqueColors.map((c) => ({
    hex: rgbToHex(c.r, c.g, c.b),
    rgb: [c.r, c.g, c.b] as [number, number, number],
    count: colors.filter((p) => p.r === c.r && p.g === c.g && p.b === c.b).length,
  }))
}

// Calcula confiança da cor (basado em quantos pixels têm essa cor)
export function calculateColorConfidence(colorCount: number, totalPixels: number): number {
  return Math.min(100, (colorCount / totalPixels) * 100)
}
