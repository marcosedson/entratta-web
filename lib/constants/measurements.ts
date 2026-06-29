import { Measurement } from '@/lib/types'

export const MEASUREMENTS: Record<string, Measurement> = {
  '40x60': { l: '40×60 cm', w: 0.4, c: 0.6 },
  '50x80': { l: '50×80 cm', w: 0.5, c: 0.8 },
  '60x90': { l: '60×90 cm', w: 0.6, c: 0.9 },
  '80x120': { l: '80×120 cm', w: 0.8, c: 1.2 },
  '100x150': { l: '100×150 cm', w: 1.0, c: 1.5 },
  custom: { l: 'Sob medida', w: 0, c: 0 },
}

export const DEFAULT_MEASUREMENT = '60x90'
