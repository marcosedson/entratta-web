export interface FontOption {
  id: string
  label: string
  family: string
  weight: string
}

export const FONTS: FontOption[] = [
  { id: 'bold', label: 'Bold', family: 'Inter, sans-serif', weight: '800' },
  { id: 'light', label: 'Clean', family: 'Inter, sans-serif', weight: '300' },
  { id: 'serif', label: 'Elegante', family: 'Georgia, serif', weight: '700' },
]

export const DEFAULT_FONT = 'bold'
