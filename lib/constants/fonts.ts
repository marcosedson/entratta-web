export interface FontOption {
  id: string
  l: string
  f: string
  w: string
}

export const FONTS: FontOption[] = [
  { id: 'bold', l: 'Bold', f: 'Inter, sans-serif', w: '800' },
  { id: 'light', l: 'Clean', f: 'Inter, sans-serif', w: '300' },
  { id: 'serif', l: 'Elegante', f: 'Georgia, serif', w: '700' },
]

export const DEFAULT_FONT = 'bold'
