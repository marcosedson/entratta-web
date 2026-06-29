export interface VinylColor {
  id: string
  label: string
  hex: string
  rgb: [number, number, number]
  available: boolean
}

export const VINYL_INVENTORY: VinylColor[] = [
  // Cores primárias
  { id: 'preto', label: 'Preto', hex: '#000000', rgb: [0, 0, 0], available: true },
  { id: 'branco', label: 'Branco', hex: '#FFFFFF', rgb: [255, 255, 255], available: true },
  { id: 'cinza', label: 'Cinza', hex: '#808080', rgb: [128, 128, 128], available: true },

  // Vermelhos
  { id: 'vermelho', label: 'Vermelho', hex: '#FF0000', rgb: [255, 0, 0], available: true },
  { id: 'vermelho-escuro', label: 'Vermelho Escuro', hex: '#8B0000', rgb: [139, 0, 0], available: true },
  { id: 'rosa', label: 'Rosa', hex: '#FF69B4', rgb: [255, 105, 180], available: true },

  // Azuis
  { id: 'azul', label: 'Azul', hex: '#0000FF', rgb: [0, 0, 255], available: true },
  { id: 'azul-escuro', label: 'Azul Escuro', hex: '#00008B', rgb: [0, 0, 139], available: true },
  { id: 'ciano', label: 'Ciano', hex: '#00FFFF', rgb: [0, 255, 255], available: true },

  // Verdes
  { id: 'verde', label: 'Verde', hex: '#00AA00', rgb: [0, 170, 0], available: true },
  { id: 'verde-escuro', label: 'Verde Escuro', hex: '#006400', rgb: [0, 100, 0], available: true },
  { id: 'verde-claro', label: 'Verde Claro', hex: '#90EE90', rgb: [144, 238, 144], available: true },
  { id: 'verde-entratta', label: 'Verde Entratta', hex: '#22C55E', rgb: [34, 197, 94], available: true },

  // Amarelos e Laranjas
  { id: 'amarelo', label: 'Amarelo', hex: '#FFFF00', rgb: [255, 255, 0], available: true },
  { id: 'ouro', label: 'Ouro', hex: '#FFD700', rgb: [255, 215, 0], available: true },
  { id: 'laranja', label: 'Laranja', hex: '#FFA500', rgb: [255, 165, 0], available: true },

  // Marrons
  { id: 'marrom', label: 'Marrom', hex: '#8B4513', rgb: [139, 69, 19], available: true },
  { id: 'marrom-claro', label: 'Marrom Claro', hex: '#D2691E', rgb: [210, 105, 30], available: true },

  // Roxos
  { id: 'roxo', label: 'Roxo', hex: '#800080', rgb: [128, 0, 128], available: true },
  { id: 'roxo-claro', label: 'Roxo Claro', hex: '#DA70D6', rgb: [218, 112, 214], available: true },

  // Tons neutros
  { id: 'bege', label: 'Bege', hex: '#F5F5DC', rgb: [245, 245, 220], available: true },
  { id: 'creme', label: 'Creme', hex: '#FFFDD0', rgb: [255, 253, 208], available: true },
]

export function findClosestVinylColor(hex: string): VinylColor {
  const [r, g, b] = hexToRgb(hex)

  let closest = VINYL_INVENTORY[0]
  let minDistance = colorDistance(r, g, b, ...closest.rgb)

  for (const vinyl of VINYL_INVENTORY) {
    const distance = colorDistance(r, g, b, ...vinyl.rgb)
    if (distance < minDistance) {
      minDistance = distance
      closest = vinyl
    }
  }

  return closest
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 0, 0]
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const dr = r1 - r2
  const dg = g1 - g2
  const db = b1 - b2
  return Math.sqrt(dr * dr + dg * dg + db * db)
}
