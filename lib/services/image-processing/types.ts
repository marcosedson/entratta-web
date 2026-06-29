export type QualityLevel = 'normal' | 'high' | 'ultra'

export interface ProcessingConfig {
  quality: QualityLevel
  preserveColors: boolean
  removeBackground: boolean
  segmentByColor: boolean
  targetVinylInventory: Array<{ id: string; label: string; hex: string }>
}

export interface SVGLayer {
  id: string
  color: string
  label: string
  svg: string
  confidence: number
}

export interface TAPFile {
  filename: string
  content: string
  colorId: string
  colorLabel: string
  layerIndex: number
}

export interface ColorInfo {
  hex: string
  rgb: [number, number, number]
  lab: [number, number, number]
  label: string
  confidence: number
  vinyl_id?: string
  vinyl_hex?: string
}

export interface ColorReport {
  hex: string
  label: string
  confidence: number
  vinylAvailable: boolean
  vinylId?: string
  vinylLabel?: string
}

export interface QualityMetrics {
  colorAccuracy: number // 0-100
  detailPreservation: number // 0-100
  processingTime: number // segundos
  estimatedPrintQuality: 'LOW' | 'NORMAL' | 'HIGH' | 'ULTRA_HD'
  numLayers: number
  numColors: number
}

export interface ProcessingResult {
  svgLayers: SVGLayer[]
  tapFiles: TAPFile[]
  colorReport: ColorReport[]
  qualityMetrics: QualityMetrics
  success: boolean
  message: string
}

export interface PreprocessedImage {
  canvas: HTMLCanvasElement
  width: number
  height: number
  data: ImageData
}

export interface SegmentedImage {
  masks: Map<string, HTMLCanvasElement> // color -> mask
  colorReport: ColorInfo[]
  originalImage: HTMLCanvasElement
}

export interface VectorizedLayer {
  color: string
  colorInfo: ColorInfo
  svg: string
  pathCount: number
}

export interface ElementInput {
  type: 'logo' | 'text'
  id: string
  data: string // base64 para logo, text content para texto
  color?: string
  x?: number
  y?: number
  scale?: number
  rotation?: number
  removeBackground?: boolean
}
