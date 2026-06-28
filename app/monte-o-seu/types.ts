export interface TextoItem {
  id: string
  texto: string
  corId: string
  fonteId: string
  x: number | null
  y: number | null
  tamanho: number // font size override (0 = auto)
}

export interface LogoItem {
  id: string
  src: string
  x: number | null
  y: number | null
  scale: number // percentage 30-190
  rotacao: number // degrees
  removingBg: boolean
}

export const CORES_TAPETE = [
  { id: 'preto',    label: 'Preto',    hex: '#1a1a1a', imageSrc: '/tapetes/cinza.png', tint: '#1a1a1a' },
  { id: 'cinza',    label: 'Cinza',    hex: '#4a4a4a', imageSrc: '/tapetes/cinza.png', tint: null },
  { id: 'verde',    label: 'Verde',    hex: '#15803D', imageSrc: '/tapetes/verde.png', tint: null },
  { id: 'azul',     label: 'Azul',     hex: '#0F2D52', imageSrc: '/tapetes/cinza.png', tint: '#0F2D52' },
  { id: 'vermelho', label: 'Vermelho', hex: '#991B1B', imageSrc: '/tapetes/cinza.png', tint: '#991B1B' },
  { id: 'marrom',   label: 'Marrom',   hex: '#78350F', imageSrc: '/tapetes/cinza.png', tint: '#78350F' },
  { id: 'bege',     label: 'Bege',     hex: '#D4B896', imageSrc: '/tapetes/cinza.png', tint: '#D4B896' },
]
export const CORES_TEXTO = [
  { id: 'branco', label: 'Branco', hex: '#FFFFFF' },
  { id: 'verde', label: 'Verde', hex: '#22C55E' },
  { id: 'amarelo', label: 'Amarelo', hex: '#EAB308' },
  { id: 'vermelho', label: 'Vermelho', hex: '#EF4444' },
  { id: 'azul', label: 'Azul', hex: '#3B82F6' },
  { id: 'preto', label: 'Preto', hex: '#111111' },
]
export const CORES_BORDA = [
  { id: 'branco', label: 'Branco', hex: '#FFFFFF' },
  { id: 'verde', label: 'Verde', hex: '#22C55E' },
  { id: 'amarelo', label: 'Amarelo', hex: '#EAB308' },
  { id: 'vermelho', label: 'Vermelho', hex: '#EF4444' },
  { id: 'azul', label: 'Azul', hex: '#3B82F6' },
  { id: 'preto', label: 'Preto', hex: '#111111' },
  { id: 'ouro', label: 'Ouro', hex: '#B8860B' },
]
export const MEDIDAS: Record<string, { l: string; w: number | null; c: number | null }> = {
  '40x60': { l: '40×60 cm', w: 0.40, c: 0.60 },
  '50x80': { l: '50×80 cm', w: 0.50, c: 0.80 },
  '60x90': { l: '60×90 cm', w: 0.60, c: 0.90 },
  '80x120': { l: '80×120 cm', w: 0.80, c: 1.20 },
  '100x150': { l: '100×150 cm', w: 1.00, c: 1.50 },
  'custom': { l: 'Sob medida', w: null, c: null },
}
export const BORDAS = [
  { id: 'sem', l: 'Sem borda' },
  { id: 'fina', l: 'Borda fina' },
  { id: 'dupla', l: 'Borda dupla' },
]
export const FONTES = [
  { id: 'bold',      l: 'Bold',        f: 'Inter, sans-serif',                  w: '800' },
  { id: 'moderna',   l: 'Moderna',     f: "'Montserrat', sans-serif",            w: '700' },
  { id: 'romana',    l: 'Romana',      f: "'Cinzel', serif",                     w: '700' },
  { id: 'bebas',     l: 'Impacto',     f: "'Bebas Neue', sans-serif",            w: '400' },
  { id: 'condensed', l: 'Condensada',  f: "'Oswald', sans-serif",                w: '600' },
  { id: 'casual',    l: 'Casual',      f: "'Pacifico', cursive",                 w: '400' },
  { id: 'cursive',   l: 'Cursiva',     f: "'Dancing Script', cursive",           w: '700' },
  { id: 'editorial', l: 'Editorial',   f: "'Playfair Display', serif",           w: '900' },
  { id: 'serif',     l: 'Elegante',    f: 'Georgia, serif',                      w: '700' },
  { id: 'rounded',   l: 'Arredondada', f: "'Nunito', sans-serif",               w: '800' },
]

export function calcPreco(medida: string, customL: string, customC: string) {
  if (medida === 'custom') {
    const l = parseFloat(customL) || 0
    const c = parseFloat(customC) || 0
    if (l > 0 && c > 0) return Math.round((l / 100) * (c / 100) * 300)
    return null
  }
  const m = MEDIDAS[medida]
  if (!m.w || !m.c) return null
  return Math.round(m.w * m.c * 300)
}

export function makeId() {
  return Math.random().toString(36).slice(2, 9)
}
